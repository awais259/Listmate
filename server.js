import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { Anthropic } from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 4000;
const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
const anthropic = new Anthropic({ apiKey });

console.log('Server starting in', __dirname);
console.log('Loaded .env:', path.join(__dirname, '.env'));
console.log('ANTHROPIC_API_KEY present:', !!apiKey);

if (!apiKey) {
  console.warn('Warning: ANTHROPIC_API_KEY is not set. /api/generate will fail without it.');
}

app.use(cors());
app.use(express.json({ limit: '15mb' }));

const dataDir = path.join(__dirname, 'data');
const historyPath = path.join(dataDir, 'history.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(historyPath);
    } catch {
      await fs.writeFile(historyPath, JSON.stringify([]));
    }
  } catch (err) {
    console.error('Failed to ensure data dir:', err);
  }
}

async function readHistory() {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(historyPath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('readHistory error', err);
    return [];
  }
}

async function appendHistory(entry) {
  try {
    const list = await readHistory();
    list.unshift(entry);
    await fs.writeFile(historyPath, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('appendHistory error', err);
  }
}

async function clearHistory() {
  try {
    await ensureDataDir();
    await fs.writeFile(historyPath, JSON.stringify([]));
  } catch (err) {
    console.error('clearHistory error', err);
  }
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
  } = req.body;

  console.log('Generate request received', { platform, itemName: !!itemName, condition, category });

  if (!itemName) {
    return res.status(400).json({ error: 'Item name is required.' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY environment variable.' });
  }

  const systemPrompt = `You are ListMate, a UK reseller listing assistant. Return only valid JSON. Respond with a JSON object matching this schema:\n{\n  "title": string,\n  "description": string,\n  "suggested_price": string,\n  "tags": string[],\n  "tip": string\n}\nDo not include any extra text, explanation, or markdown. Only output valid JSON.`;

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

  const userPrompt = `Input data:\n${JSON.stringify(userPayload, null, 2)}\nIf an imageBase64 is provided separately, you may use it to infer condition or visible details, but respond in JSON only.`;

  try {
    const result = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
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

    // Save to history (best-effort)
    try {
      await appendHistory({
        timestamp: new Date().toISOString(),
        platform,
        itemName,
        condition,
        category,
        details,
        price,
        postage,
        output: parsed || rawText,
      });
    } catch (e) {
      console.error('Failed to append history', e);
    }

    return res.json({ output: parsed || rawText, raw: rawText });
  } catch (error) {
    console.error('Generate endpoint exception', error);
    return res.status(500).json({ error: error.message || 'Unable to generate listing.', details: error.toString() });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const entry = req.body;
    if (!entry) return res.status(400).json({ error: 'Missing body' });
    entry.timestamp = entry.timestamp || new Date().toISOString();
    await appendHistory(entry);
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/history error', err);
    res.status(500).json({ error: 'Unable to save history.' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const list = await readHistory();
    res.json({ history: list });
  } catch (err) {
    console.error('GET /api/history error', err);
    res.status(500).json({ error: 'Unable to read history.' });
  }
});

app.delete('/api/history', async (req, res) => {
  try {
    await clearHistory();
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/history error', err);
    res.status(500).json({ error: 'Unable to clear history.' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error', err);
  res.status(500).json({ error: 'Internal server error', details: err?.message });
});

app.listen(port, () => {
  console.log(`ListMate backend running on http://localhost:${port}`);
});
