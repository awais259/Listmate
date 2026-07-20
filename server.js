import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs, existsSync } from 'fs';
import { Anthropic } from '@anthropic-ai/sdk';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 4000;
const apiKey = process.env.ANTHROPIC_API_KEY?.trim() || null;
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim() || null;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Initialise clients only when keys are present (prevents crash on missing keys)
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

// ── Supabase (single source of truth for history + subscriptions) ──────────────
// Uses the service-role key so the server can read/write on behalf of any user.
// If not configured, the app transparently falls back to local JSON files.
const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
  : null;

// Stripe price IDs — set these in .env once you've created products in the Stripe Dashboard.
// If not set, checkout falls back to price_data (creates ad-hoc products each time).
const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || null,
  pro:     process.env.STRIPE_PRO_PRICE_ID     || null,
};

// Fallback unit amounts (pence) used when price IDs are not configured
const PLAN_PRICES = {
  starter: 599,  // £5.99
  pro:     1199, // £11.99
};

console.log('Server starting in', __dirname);
console.log('Loaded .env:', path.join(__dirname, '.env'));
console.log('ANTHROPIC_API_KEY present:', !!apiKey);
console.log('STRIPE_SECRET_KEY present:', !!stripeKey);
console.log('Supabase storage:', supabaseAdmin ? 'ENABLED (Supabase)' : 'DISABLED (local JSON fallback)');

if (!apiKey) {
  console.warn('⚠️  ANTHROPIC_API_KEY not set — /api/generate will return mock listings (demo mode).');
}
if (!stripeKey) {
  console.warn('⚠️  STRIPE_SECRET_KEY not set — /api/create-checkout-session will return a demo URL.');
}

// Stripe webhook needs raw body — mount BEFORE express.json()
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// ── Serve the built frontend when it exists (production single-service deploy) ─
const distDir = path.join(__dirname, 'dist');
const serveFrontend = existsSync(distDir);
if (serveFrontend) {
  app.use(express.static(distDir));
  console.log('Serving frontend from', distDir);
}

// ── Data directory helpers ────────────────────────────────────────────────────
const dataDir        = path.join(__dirname, 'data');
const historyDir     = path.join(dataDir, 'history');
const subsPath       = path.join(dataDir, 'subscriptions.json');
const legacyHistPath = path.join(dataDir, 'history.json'); // backward compat

const PLAN_LIMITS = { free: 5, starter: 50, pro: Infinity };

async function ensureDataDir() {
  await fs.mkdir(historyDir, { recursive: true });
  try { await fs.access(subsPath); }
  catch { await fs.writeFile(subsPath, JSON.stringify({})); }
}
ensureDataDir().catch(console.error);

// ── Subscriptions ─────────────────────────────────────────────────────────────
// Local JSON fallback helpers (used only when Supabase is not configured)
async function readSubs() {
  try { return JSON.parse(await fs.readFile(subsPath, 'utf8') || '{}'); }
  catch { return {}; }
}
async function writeSubs(data) {
  await fs.writeFile(subsPath, JSON.stringify(data, null, 2));
}

async function getUserPlan(userId) {
  if (!userId) return 'free';
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) { console.error('getUserPlan (supabase)', error.message); return 'free'; }
    if (!data || data.status === 'cancelled') return 'free';
    return data.plan || 'free';
  }
  const subs = await readSubs();
  return subs[userId]?.plan || 'free';
}

// Create or update a user's subscription row
async function upsertSubscription(userId, patch) {
  if (!userId) return;
  if (supabaseAdmin) {
    const row = {
      user_id: userId,
      plan: patch.plan,
      stripe_customer_id: patch.stripeCustomerId,
      stripe_subscription_id: patch.stripeSubscriptionId,
      status: patch.status ?? 'active',
      updated_at: new Date().toISOString(),
    };
    Object.keys(row).forEach((k) => row[k] === undefined && delete row[k]);
    const { error } = await supabaseAdmin.from('subscriptions').upsert(row, { onConflict: 'user_id' });
    if (error) console.error('upsertSubscription (supabase)', error.message);
    return;
  }
  const subs = await readSubs();
  subs[userId] = { ...subs[userId], ...patch, updatedAt: new Date().toISOString() };
  await writeSubs(subs);
}

// Find the user id that owns a given Stripe customer id
async function findSubUserByCustomer(customerId) {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    if (error) { console.error('findSubUserByCustomer (supabase)', error.message); return null; }
    return data?.user_id || null;
  }
  const subs = await readSubs();
  return Object.keys(subs).find((id) => subs[id]?.stripeCustomerId === customerId) || null;
}

// ── Per-user history ──────────────────────────────────────────────────────────
function userHistPath(userId) {
  // sanitise userId so it's safe as a filename
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
  return path.join(historyDir, `${safe}.json`);
}

// Normalise a Supabase listings row into the shape the frontend expects
function rowToEntry(r) {
  return {
    platform: r.platform,
    itemName: r.item_name,
    condition: r.condition,
    category: r.category,
    details: r.details,
    price: r.price,
    postage: r.postage,
    output: r.output,
    createdAt: r.created_at,
    timestamp: r.created_at,
    _demo: r.is_demo || false,
  };
}

async function readHistory(userId) {
  if (supabaseAdmin) {
    if (!userId) return [];
    const { data, error } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) { console.error('readHistory (supabase)', error.message); return []; }
    return (data || []).map(rowToEntry);
  }
  // No userId → fall back to legacy shared file
  const filePath = userId ? userHistPath(userId) : legacyHistPath;
  try { return JSON.parse(await fs.readFile(filePath, 'utf8') || '[]'); }
  catch { return []; }
}

async function appendHistory(entry, userId) {
  if (supabaseAdmin) {
    if (!userId) return;
    const row = {
      user_id: userId,
      platform: entry.platform,
      item_name: entry.itemName,
      condition: entry.condition,
      category: entry.category,
      details: entry.details,
      price: entry.price != null ? String(entry.price) : null,
      postage: entry.postage,
      output: entry.output,
      is_demo: entry._demo || false,
    };
    const { error } = await supabaseAdmin.from('listings').insert(row);
    if (error) console.error('appendHistory (supabase)', error.message);
    return;
  }
  const filePath = userId ? userHistPath(userId) : legacyHistPath;
  try {
    let list = [];
    try { list = JSON.parse(await fs.readFile(filePath, 'utf8') || '[]'); } catch {}
    list.unshift(entry);
    await fs.writeFile(filePath, JSON.stringify(list, null, 2));
  } catch (err) { console.error('appendHistory error', err); }
}

async function clearHistory(userId) {
  if (supabaseAdmin) {
    if (!userId) return;
    const { error } = await supabaseAdmin.from('listings').delete().eq('user_id', userId);
    if (error) console.error('clearHistory (supabase)', error.message);
    return;
  }
  const filePath = userId ? userHistPath(userId) : legacyHistPath;
  await fs.writeFile(filePath, JSON.stringify([])).catch(console.error);
}

// ── Quota helper ──────────────────────────────────────────────────────────────
async function getUsageThisMonth(userId) {
  if (!userId) return 0;
  const now = new Date();
  if (supabaseAdmin) {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { count, error } = await supabaseAdmin
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth);
    if (error) { console.error('getUsageThisMonth (supabase)', error.message); return 0; }
    return count || 0;
  }
  const history = await readHistory(userId);
  return history.filter((e) => {
    try {
      const d = new Date(e.timestamp || e.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    } catch { return false; }
  }).length;
}

app.get('/', (req, res) => {
  res.send('ListMate backend is running.');
});

app.post('/api/generate', async (req, res) => {
  const {
    platform = 'eBay',
    itemName,
    condition,
    category,
    details,
    price,
    postage,
    imageBase64,
    tone = 'Professional',
    language = 'English (UK)',
    includeEmojis = false,
    includeHashtags = true,
    userId,
  } = req.body;

  console.log('Generate request received', { platform, itemName: !!itemName, condition, category, userId: !!userId });

  if (!itemName) {
    return res.status(400).json({ error: 'Item name is required.' });
  }

  // Require a signed-in user — prevents anonymous API abuse (quota bypass)
  if (!userId) {
    return res.status(401).json({ error: 'Please sign in to generate listings.' });
  }

  // ── Quota enforcement ──────────────────────────────────────────────────────
  if (userId) {
    const plan = await getUserPlan(userId);
    const limit = PLAN_LIMITS[plan] ?? 5;
    if (limit !== Infinity) {
      const used = await getUsageThisMonth(userId);
      if (used >= limit) {
        return res.status(429).json({
          error: `You've used all ${limit} listings for this month on the ${plan} plan. Upgrade to continue.`,
          quota: { used, limit, plan },
        });
      }
    }
  }
  // ── End quota check ────────────────────────────────────────────────────────

  // ── DEMO MODE: no API key → return a realistic mock listing ──────────────
  if (!apiKey) {
    console.log('[Demo mode] No ANTHROPIC_API_KEY — returning mock listing for:', itemName);

    const priceNum = parseFloat(price) || 0;
    const suggestedPrice = priceNum > 0
      ? `£${priceNum.toFixed(2)}`
      : platform === 'eBay' ? '£29.99' : platform === 'Vinted' ? '£18.00' : '£24.99';

    const conditionNote = condition?.toLowerCase().includes('new')
      ? 'in perfect, unused condition'
      : condition?.toLowerCase().includes('good')
        ? 'in great used condition with minimal signs of wear'
        : 'in good pre-loved condition';

    const platformTips = {
      eBay: 'Use all 80 characters in your title and add item specifics to boost search visibility. Free postage listings rank higher.',
      Vinted: 'Upload at least 4 clear photos on a neutral background. Bundles and fast shipping boost your profile rating.',
      Depop: 'Use relevant hashtags in your description. Followers and likes are boosted by engagement — respond to offers quickly.',
      'TikTok Shop': 'Short video content dramatically increases conversion. Use trending sounds and show the item in use.',
    };

    const tags = includeHashtags ? [
      itemName.split(' ')[0]?.toLowerCase(),
      condition?.toLowerCase().replace(/[^a-z]/g, '') || 'preowned',
      category?.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12) || 'fashion',
      platform.toLowerCase().replace(/\s/g, ''),
      'ukreseller',
      'bargain',
    ].filter(Boolean).slice(0, 6) : [];

    const emoji = includeEmojis ? '✨ ' : '';
    const mockOutput = {
      title: `${emoji}${itemName} — ${condition} | ${platform === 'eBay' ? 'Fast & Free UK Delivery' : 'Great Condition'}`,
      description: `For sale: ${itemName}\n\nCondition: ${condition} — This item is ${conditionNote}.${details ? `\n\nSeller notes: ${details}` : ''}\n\nPostage: ${postage || 'See listing details'}.\n\nPlease check my other listings for more great deals!`,
      suggested_price: suggestedPrice,
      tags,
      tip: `[Demo mode] Tone: ${tone}, Language: ${language}. ${platformTips[platform] || 'Take clear, well-lit photos and be honest about condition to build trust and get more sales.'}`,
    };

    await appendHistory({
      timestamp: new Date().toISOString(),
      platform, itemName, condition, category, details, price, postage,
      output: mockOutput, _demo: true,
    }, userId).catch(console.error);

    return res.json({ output: mockOutput, raw: JSON.stringify(mockOutput), _demo: true });
  }
  // ── END DEMO MODE ─────────────────────────────────────────────────────────

  // ── Build listing-preference instructions ──────────────────────────────────
  const emojiRule = includeEmojis
    ? 'Include a few tasteful, relevant emojis in the title and description to add appeal.'
    : 'Do not use any emojis anywhere in the output.';
  const hashtagRule = includeHashtags
    ? 'Provide 5-8 relevant, high-search keyword tags in the "tags" array (no # symbol, lowercase).'
    : 'Return an empty array for "tags".';

  const systemPrompt = `You are ListMate, a UK reseller listing assistant. Return only valid JSON. Respond with a JSON object matching this schema:\n{\n  "title": string,\n  "description": string,\n  "suggested_price": string,\n  "tags": string[],\n  "tip": string\n}\n\nListing preferences:\n- Write ALL text (title, description, tags, tip) in ${language}.\n- Use a ${tone} tone and voice throughout.\n- ${emojiRule}\n- ${hashtagRule}\n\nDo not include any extra text, explanation, or markdown. Only output valid JSON.`;

  const userPayload = {
    platform,
    itemName,
    condition,
    category,
    details,
    price,
    postage,
    hasImage: !!imageBase64,
  };

  const userPrompt = `Input data:\n${JSON.stringify(userPayload, null, 2)}\n\nIf a product image is attached, analyse it to infer brand, condition, colour, material and other visible details, and use that to improve the title and description. Respond in JSON only.`;

  // Attach the image as a real vision block when provided (data URL → base64)
  const userContent = [];
  if (imageBase64) {
    const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(imageBase64);
    if (m) {
      userContent.push({ type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } });
    }
  }
  userContent.push({ type: 'text', text: userPrompt });

  try {
    const result = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      system: systemPrompt,
      messages: [
        { role: 'user', content: userContent },
      ],
      max_tokens: 1000,
      temperature: 0.2,
    });

    console.log('Anthropic SDK response', result);

    const blocks = result.content ?? [];
    const rawText = blocks
      .map((block) => {
        if (!block || typeof block !== 'object') return '';
        if ('text' in block) return block.text || '';
        if ('type' in block && block.type === 'text' && 'text' in block) return block.text || '';
        return '';
      })
      .join('')
      .trim();

    const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();

    let parsed = null;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.warn('Failed to parse JSON from model output', e);
    }

    // Save to per-user history (best-effort)
    await appendHistory({
      timestamp: new Date().toISOString(),
      platform, itemName, condition, category, details, price, postage,
      output: parsed || rawText,
    }, userId).catch(console.error);

    return res.json({ output: parsed || rawText, raw: rawText });
  } catch (error) {
    console.error('Generate endpoint exception', error);
    return res.status(500).json({ error: error.message || 'Unable to generate listing.', details: error.toString() });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const { userId } = req.query;
    const list = await readHistory(userId);
    res.json({ history: list });
  } catch (err) {
    console.error('GET /api/history error', err);
    res.status(500).json({ error: 'Unable to read history.' });
  }
});

app.delete('/api/history', async (req, res) => {
  try {
    const { userId } = req.query;
    await clearHistory(userId);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/history error', err);
    res.status(500).json({ error: 'Unable to clear history.' });
  }
});

// ── Quota endpoint ─────────────────────────────────────────────────────────────
app.get('/api/quota', async (req, res) => {
  const { userId } = req.query;
  try {
    const plan = await getUserPlan(userId);
    const limit = PLAN_LIMITS[plan];
    const usedThisMonth = userId ? await getUsageThisMonth(userId) : 0;
    res.json({
      plan,
      limit: limit === Infinity ? null : limit,
      usedThisMonth,
      remaining: limit === Infinity ? null : Math.max(0, limit - usedThisMonth),
    });
  } catch (err) {
    console.error('GET /api/quota error', err);
    res.status(500).json({ error: 'Unable to fetch quota.' });
  }
});

// ── Stripe webhook ─────────────────────────────────────────────────────────────
app.post('/api/stripe-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.warn('[webhook] Stripe not configured — ignoring webhook.');
    return res.json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Stripe event received:', event.type);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan || 'starter';
      if (userId) {
        await upsertSubscription(userId, {
          plan,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          status: 'active',
        });
        console.log(`✅ Subscription activated: user=${userId} plan=${plan}`);
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object;
      const customerId = sub.customer;
      const userId = await findSubUserByCustomer(customerId);
      if (userId) {
        const newPlan = sub.items?.data?.[0]?.price?.nickname?.toLowerCase() || undefined;
        await upsertSubscription(userId, {
          plan: newPlan,
          stripeCustomerId: customerId,
          status: sub.status,
        });
        console.log(`🔄 Subscription updated: user=${userId} plan=${newPlan || '(unchanged)'} status=${sub.status}`);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const customerId = sub.customer;
      const userId = await findSubUserByCustomer(customerId);
      if (userId) {
        await upsertSubscription(userId, {
          plan: 'free',
          stripeCustomerId: customerId,
          status: 'cancelled',
        });
        console.log(`❌ Subscription cancelled: user=${userId}`);
      }
    }
  } catch (err) {
    console.error('Error processing webhook event:', err);
  }

  res.json({ received: true });
});

app.post('/api/create-checkout-session', async (req, res) => {
  const { plan, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  const unitAmount = PLAN_PRICES[plan];
  if (!unitAmount) {
    return res.status(400).json({ error: `Invalid plan: ${plan}` });
  }

  // Demo mode when Stripe key is missing
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('[Demo mode] No STRIPE_SECRET_KEY — returning mock checkout URL');
    return res.json({ url: `${frontendUrl}/dashboard?payment=demo&plan=${plan}` });
  }

  try {
    // Use a saved Stripe price ID if configured, otherwise create ad-hoc via price_data
    const priceId = STRIPE_PRICE_IDS[plan];
    const lineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: 'gbp',
            product_data: { name: plan === 'pro' ? 'ListMate Pro' : 'ListMate Starter' },
            unit_amount: unitAmount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [lineItem],
      metadata: { userId, plan },
      success_url: `${frontendUrl}/dashboard?payment=success`,
      cancel_url: `${frontendUrl}/pricing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('create-checkout-session error', error);
    res.status(500).json({ error: error.message || 'Unable to create checkout session.' });
  }
});

// ── SPA fallback: send index.html for any non-API route (client-side routing) ──
if (serveFrontend) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Unhandled server error', err);
  res.status(500).json({ error: 'Internal server error', details: err?.message });
});

app.listen(port, () => {
  console.log(`ListMate backend running on http://localhost:${port}`);
});
