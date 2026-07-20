/**
 * migrate-to-supabase.js
 *
 * One-time migration of existing local JSON data into Supabase.
 * Moves data/history/*.json  → public.listings
 *       data/subscriptions.json → public.subscriptions
 *
 * Prerequisites:
 *   1. Run supabase-setup.sql in the Supabase SQL Editor (creates the tables).
 *   2. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.
 *
 * Run:  node migrate-to-supabase.js
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!url || !key) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env before migrating.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const dataDir = path.join(__dirname, 'data');
const historyDir = path.join(dataDir, 'history');

async function migrateHistory() {
  let files = [];
  try { files = await fs.readdir(historyDir); }
  catch { console.log('• No data/history directory — skipping history.'); return; }

  let total = 0;
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const userId = file.replace(/\.json$/, '');
    let list = [];
    try { list = JSON.parse(await fs.readFile(path.join(historyDir, file), 'utf8') || '[]'); }
    catch { continue; }
    if (!Array.isArray(list) || list.length === 0) continue;

    const rows = list.map((e) => ({
      user_id: userId,
      platform: e.platform,
      item_name: e.itemName,
      condition: e.condition,
      category: e.category,
      details: e.details,
      price: e.price != null ? String(e.price) : null,
      postage: e.postage,
      output: e.output,
      is_demo: e._demo || false,
      created_at: e.timestamp || e.createdAt || new Date().toISOString(),
    }));

    const { error } = await supabase.from('listings').insert(rows);
    if (error) console.error(`  ✗ ${userId}: ${error.message}`);
    else { total += rows.length; console.log(`  ✓ ${userId}: ${rows.length} listings`); }
  }
  console.log(`History migrated: ${total} rows.\n`);
}

async function migrateSubs() {
  const subsPath = path.join(dataDir, 'subscriptions.json');
  let subs = {};
  try { subs = JSON.parse(await fs.readFile(subsPath, 'utf8') || '{}'); }
  catch { console.log('• No subscriptions.json — skipping subscriptions.'); return; }

  const rows = Object.entries(subs).map(([userId, s]) => ({
    user_id: userId,
    plan: s.plan || 'free',
    stripe_customer_id: s.stripeCustomerId || null,
    stripe_subscription_id: s.stripeSubscriptionId || null,
    status: s.status || 'active',
    updated_at: s.updatedAt || new Date().toISOString(),
  }));

  if (rows.length === 0) { console.log('No subscriptions to migrate.'); return; }

  const { error } = await supabase.from('subscriptions').upsert(rows, { onConflict: 'user_id' });
  if (error) console.error(`  ✗ subscriptions: ${error.message}`);
  else console.log(`Subscriptions migrated: ${rows.length} rows.`);
}

(async () => {
  console.log('Migrating local JSON → Supabase…\n');
  await migrateHistory();
  await migrateSubs();
  console.log('\n✅ Migration complete.');
})().catch((e) => { console.error(e); process.exit(1); });
