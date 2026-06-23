import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthProvider';

const PLATFORMS = ['eBay', 'Vinted', 'Depop', 'TikTok Shop'];
const CONDITIONS = ['Brand new', 'New with tags', 'Used - Good', 'Used - Fair'];
const POSTAGE = ['Buyer pays', 'Free postage', 'Flat rate', 'Calculated'];
const SAMPLE_CATEGORIES = ['Clothing', 'Electronics', 'Home & Garden', 'Collectibles', 'Other'];

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('eBay');
  const [itemName, setItemName] = useState('');
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [category, setCategory] = useState(SAMPLE_CATEGORIES[0]);
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [postage, setPostage] = useState(POSTAGE[0]);
  const [imageFile, setImageFile] = useState(null);

  const [outputObj, setOutputObj] = useState(null);
  const [rawOutput, setRawOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  async function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function generateListing(formData) {
    setOutputObj(null);
    setRawOutput('');
    setError('');
    setLoading(true);

    try {
      let imageBase64 = null;
      if (imageFile) {
        imageBase64 = await readFileAsDataUrl(imageFile);
      }

      const body = {
        ...formData,
        imageBase64,
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        const message = data.error || `Server error: ${response.statusText}`;
        throw new Error(message + (data.raw ? ` | raw: ${data.raw}` : ''));
      }

      const responseOutput = data.output;
      const parsedObj = typeof responseOutput === 'object' && responseOutput !== null ? responseOutput : null;
      const rawText = typeof responseOutput === 'string' ? responseOutput : data.raw || JSON.stringify(responseOutput || '', null, 2);

      setOutputObj(parsedObj);
      setRawOutput(rawText);
      loadHistory();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await generateListing({ platform, itemName, condition, category, details, price, postage });
  };

  const handleRegenerate = async () => {
    await generateListing({ platform, itemName, condition, category, details, price, postage });
  };

  const resetForm = () => {
    setPlatform('eBay');
    setItemName('');
    setCondition(CONDITIONS[0]);
    setCategory(SAMPLE_CATEGORIES[0]);
    setDetails('');
    setPrice('');
    setPostage(POSTAGE[0]);
    setImageFile(null);
    setOutputObj(null);
    setRawOutput('');
    setError('');
  };

  async function loadHistory() {
    try {
      const res = await fetch('/api/history');
      if (!res.ok) return;
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) {
      console.warn('Could not load history', e);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function clearHistory() {
    if (!confirm('Clear all saved history?')) return;
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (res.ok) setHistory([]);
    } catch (e) {
      console.warn('Failed to clear history', e);
    }
  }

  function exportHistory() {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'listmate-history.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(text) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => {});
  }

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <div className="card">
        <div className="app-header">
          <div>
            <p className="app-welcome">Welcome back{user?.email ? `, ${user.email}` : ''}.</p>
            <p className="app-subtitle">Create marketplace-ready resale listings with AI guidance.</p>
          </div>
          <button type="button" className="secondary" onClick={handleSignOut}>Logout</button>
        </div>
        <section className="hero">
          <div>
            <span className="hero-badge">AI Listing Assistant</span>
            <h1>ListMate helps UK resellers build better listings instantly.</h1>
            <p>Generate marketplace-ready listing titles, descriptions, pricing suggestions, tags and platform tips for eBay, Vinted, Depop and TikTok Shop.</p>
            <div className="hero-actions">
              <button type="button" onClick={() => document.getElementById('dashboard-form')?.scrollIntoView({ behavior: 'smooth' })}>Start generating</button>
              <button type="button" className="secondary" onClick={() => document.getElementById('history-panel')?.scrollIntoView({ behavior: 'smooth' })}>View history</button>
            </div>
          </div>
          <div className="hero-features">
            <div className="feature-card">
              <strong>Multi-platform</strong>
              <p>Optimised copy for the top resale channels with one click.</p>
            </div>
            <div className="feature-card">
              <strong>JSON output</strong>
              <p>Clean data-ready listings plus tag and tip generation.</p>
            </div>
            <div className="feature-card">
              <strong>Fast workflow</strong>
              <p>Copy outputs, export history, and regenerate immediately.</p>
            </div>
          </div>
        </section>

        <div className="io-grid">
          <div className="io-col io-input panel">
            <form id="dashboard-form" onSubmit={handleSubmit}>
              <label>
                Platform
                <div className="button-group">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={platform === p ? 'active' : ''}
                      aria-pressed={platform === p}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </label>

              <label>
                Item name
                <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. Vintage Levi's Jeans" required />
              </label>

              <label>
                Condition
                <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {SAMPLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              <label>
                Extra details
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} placeholder="Add size, material, flaws, etc." />
              </label>

              <label>
                Price (£)
                <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 19.99" />
              </label>

              <label>
                Postage
                <select value={postage} onChange={(e) => setPostage(e.target.value)}>
                  {POSTAGE.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>

              <label>
                Image (optional)
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {imageFile && <span className="file-name">{imageFile.name}</span>}
              </label>

              <div className="form-actions">
                <button type="submit" disabled={!itemName.trim() || loading}>{loading ? 'Generating...' : 'Generate listing'}</button>
                <button type="button" className="secondary" onClick={resetForm}>Reset</button>
              </div>
            </form>
          </div>

          <div className="io-col io-output panel">
            <div className="message result preview">
              <h2>Output</h2>
              {error && <div className="message error">{error}</div>}

              {outputObj ? (
                <div>
                  <div className="output-header">
                    <div>
                      <h3>{outputObj.title}</h3>
                      <p className="output-meta">Suggested price: {outputObj.suggested_price}</p>
                    </div>
                    <div className="output-actions">
                      <button type="button" onClick={() => copyToClipboard(outputObj.title)}>Copy title</button>
                      <button type="button" onClick={() => copyToClipboard(outputObj.description)}>Copy description</button>
                    </div>
                  </div>

                  <div className="output-block">
                    <strong>Description</strong>
                    <p>{outputObj.description}</p>
                  </div>

                  <div className="output-block">
                    <strong>Tags</strong>
                    <div className="tag-list">
                      {Array.isArray(outputObj.tags) ? outputObj.tags.map((tag) => <span key={tag}>{tag}</span>) : <span>None</span>}
                    </div>
                  </div>

                  <div className="output-block">
                    <strong>Platform tip</strong>
                    <p>{outputObj.tip}</p>
                  </div>

                  <div className="output-actions-row">
                    <button type="button" onClick={handleRegenerate} disabled={loading}>{loading ? 'Regenerating...' : 'Regenerate'}</button>
                    <button type="button" onClick={() => copyToClipboard(JSON.stringify(outputObj, null, 2))} disabled={!outputObj}>Copy JSON</button>
                  </div>
                </div>
              ) : (
                <div className="output-empty">
                  <pre>{rawOutput || 'Generated output will appear here.'}</pre>
                </div>
              )}

              <div className="output-actions-row" style={{ marginTop: 8 }}>
                <button type="button" onClick={() => copyToClipboard(rawOutput || '')} disabled={!rawOutput}>Copy Raw</button>
                <button type="button" className="secondary" onClick={exportHistory} disabled={history.length === 0}>Export History</button>
              </div>
            </div>

            {history.length > 0 && (
              <div className="message history" id="history-panel">
                <h3>Saved History</h3>
                <div className="button-group" style={{ marginBottom: 8 }}>
                  <button type="button" onClick={exportHistory}>Export JSON</button>
                  <button type="button" className="secondary" onClick={clearHistory}>Clear History</button>
                </div>
                {history.map((h, idx) => (
                  <div key={h.timestamp || idx} className="history-item">
                    <div className="meta">{new Date(h.timestamp).toLocaleString()}</div>
                    <div className="title">{h.itemName}</div>
                    <pre className="history-output">{typeof h.output === 'string' ? h.output : JSON.stringify(h.output, null, 2)}</pre>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => copyToClipboard(typeof h.output === 'string' ? h.output : JSON.stringify(h.output, null, 2))}>Copy</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
