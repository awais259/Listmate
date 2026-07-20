import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthProvider';
import LogoMark from './LogoMark';

const PLATFORMS = ['eBay', 'Vinted', 'Depop', 'TikTok Shop'];
const CONDITIONS = ['Brand new', 'New with tags', 'Used - Good', 'Used - Fair'];
const POSTAGE = ['Buyer pays', 'Free postage', 'Flat rate', 'Calculated'];
const TONES = ['Professional', 'Casual', 'Luxury', 'Gen Z', 'Descriptive'];
const LANGUAGES = ['English (UK)', 'French', 'German', 'Spanish', 'Italian', 'Dutch', 'Portuguese'];

const CATEGORIES = {
  eBay: [
    'Clothing, Shoes & Accessories',
    'Electronics',
    'Mobile Phones & Accessories',
    'Computers & Tablets',
    'Cameras & Photography',
    'Home & Garden',
    'Furniture & DIY',
    'Toys & Games',
    'Sports & Outdoors',
    'Books, Comics & Magazines',
    'Music',
    'Movies & TV',
    'Collectibles & Art',
    'Health & Beauty',
    'Jewellery & Watches',
    'Baby & Kids',
    'Automotive',
    'Musical Instruments',
    'Pet Supplies',
    'Business & Industrial',
    'Other',
  ],
  Vinted: [
    "Women's Clothing",
    "Men's Clothing",
    "Kids' Clothing",
    'Shoes & Boots',
    'Bags & Accessories',
    'Jewellery & Watches',
    'Sportswear',
    'Swimwear & Lingerie',
    'Home & Living',
    'Electronics',
    'Books, Games & Movies',
    'Beauty & Health',
    'Other',
  ],
  Depop: [
    'Tops & T-Shirts',
    'Bottoms (Jeans, Trousers)',
    'Dresses & Skirts',
    'Outerwear & Coats',
    'Footwear',
    'Bags & Accessories',
    'Jewellery',
    'Activewear',
    'Vintage & Streetwear',
    'Swimwear',
    'Electronics',
    'Home & Garden',
    'Books & Stationery',
    'Art & Collectibles',
    'Other',
  ],
  'TikTok Shop': [
    "Women's Clothing",
    "Men's Clothing",
    'Shoes & Footwear',
    'Bags & Accessories',
    'Beauty & Personal Care',
    'Skincare & Haircare',
    'Health & Wellness',
    'Electronics & Gadgets',
    'Phones & Accessories',
    'Home & Living',
    'Kitchen & Dining',
    'Sports & Outdoors',
    'Toys & Hobbies',
    'Books & Stationery',
    'Pet Supplies',
    'Jewellery & Watches',
    'Baby & Kids',
    'Automotive Accessories',
    'Other',
  ],
};

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('eBay');
  const [itemName, setItemName] = useState('');
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [category, setCategory] = useState(CATEGORIES['eBay'][0]);
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [postage, setPostage] = useState(POSTAGE[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [outputObj, setOutputObj] = useState(null);
  const [rawOutput, setRawOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [copiedKey, setCopiedKey] = useState('');
  const outputRef = useRef(null);

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
        userId: user?.id,
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        // Quota exceeded — friendly message with upgrade link
        if (response.status === 429) {
          throw new Error(data.error || 'Monthly limit reached. Upgrade your plan to continue.');
        }
        const message = data.error || `Server error: ${response.statusText}`;
        throw new Error(message + (data.raw ? ` | raw: ${data.raw}` : ''));
      }

      const responseOutput = data.output;
      const parsedObj = typeof responseOutput === 'object' && responseOutput !== null ? responseOutput : null;
      const rawText = typeof responseOutput === 'string' ? responseOutput : data.raw || JSON.stringify(responseOutput || '', null, 2);

      setOutputObj(parsedObj);
      setRawOutput(rawText);
      loadHistory();
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await generateListing({ platform, itemName, condition, category, details, price, postage, tone, language, includeEmojis, includeHashtags });
  };

  const handleRegenerate = async () => {
    await generateListing({ platform, itemName, condition, category, details, price, postage, tone, language, includeEmojis, includeHashtags });
  };

  const resetForm = () => {
    setPlatform('eBay');
    setItemName('');
    setCondition(CONDITIONS[0]);
    setCategory(CATEGORIES['eBay'][0]);
    setDetails('');
    setPrice('');
    setPostage(POSTAGE[0]);
    setTone(TONES[0]);
    setLanguage(LANGUAGES[0]);
    setIncludeEmojis(false);
    setIncludeHashtags(true);
    setImageFile(null);
    setOutputObj(null);
    setRawOutput('');
    setError('');
  };

  async function loadHistory() {
    try {
      const qs = user?.id ? `?userId=${encodeURIComponent(user.id)}` : '';
      const res = await fetch(`/api/history${qs}`);
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
      const qs = user?.id ? `?userId=${encodeURIComponent(user.id)}` : '';
      const res = await fetch(`/api/history${qs}`, { method: 'DELETE' });
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

  function copyToClipboard(text, key = '') {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      if (key) {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(''), 1800);
      }
    }).catch(() => {});
  }

  function buildFullListing(obj) {
    const parts = [];
    if (obj.title) parts.push(`TITLE:\n${obj.title}`);
    if (obj.suggested_price) parts.push(`PRICE:\n${obj.suggested_price}`);
    if (obj.description) parts.push(`DESCRIPTION:\n${obj.description}`);
    if (Array.isArray(obj.tags) && obj.tags.length) parts.push(`TAGS:\n${obj.tags.map(t => `#${t}`).join('  ')}`);
    if (obj.tip) parts.push(`TIP:\n${obj.tip}`);
    return parts.join('\n\n');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <LogoMark size={40} />
            <div>
              <p className="app-welcome">Welcome back{user?.email ? `, ${user.email}` : ''}.</p>
              <p className="app-subtitle">Create marketplace-ready resale listings with AI guidance.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/settings" style={{ textDecoration: 'none' }}>
              <button type="button" className="secondary">⚙ Settings</button>
            </Link>
            <button type="button" className="secondary" onClick={handleSignOut}>Logout</button>
          </div>
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
                      onClick={() => { setPlatform(p); setCategory(CATEGORIES[p][0]); }}
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
                  {CATEGORIES[platform].map((c) => <option key={c} value={c}>{c}</option>)}
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
                Writing tone
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label>
                Output language
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </label>

              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', margin: '4px 0 2px' }}>
                <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" style={{ width: 'auto', margin: 0 }} checked={includeEmojis} onChange={(e) => setIncludeEmojis(e.target.checked)} />
                  Include emojis
                </label>
                <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" style={{ width: 'auto', margin: 0 }} checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} />
                  Include hashtags / tags
                </label>
              </div>

              <label>
                Image (optional)
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {imageFile && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="preview"
                      style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1.5px solid rgba(99,102,241,0.35)' }}
                    />
                    <span className="file-name" style={{ flex: 1 }}>{imageFile.name}</span>
                    <button type="button" className="secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => setImageFile(null)}>✕</button>
                  </div>
                )}
              </label>

              <div className="form-actions">
                <button type="submit" disabled={!itemName.trim() || loading}>{loading ? 'Generating...' : 'Generate listing'}</button>
                <button type="button" className="secondary" onClick={resetForm}>Reset</button>
              </div>
            </form>
          </div>

          <div className="io-col io-output panel" ref={outputRef}>
            <div className="output-panel-header">
              <h2 style={{ margin: 0 }}>Generated Listing</h2>
              {outputObj && (
                <button
                  type="button"
                  className="copy-all-btn"
                  onClick={() => copyToClipboard(buildFullListing(outputObj), 'all')}
                >
                  {copiedKey === 'all' ? '✓ Copied!' : '⧉ Copy Full Listing'}
                </button>
              )}
            </div>

            {error && <div className="message error" style={{ marginTop: 12 }}>{error}</div>}

            {loading ? (
              <div className="listing-skeleton">
                <div className="skel-badge" />
                <div className="skel-title" />
                <div className="skel-line" style={{ width: '55%' }} />
                <div className="skel-block" />
                <div className="skel-line" style={{ width: '80%', marginTop: 8 }} />
                <div className="skel-line" style={{ width: '65%', marginTop: 8 }} />
                <div className="skel-tags">
                  {[1,2,3,4].map(i => <div key={i} className="skel-tag" />)}
                </div>
              </div>
            ) : outputObj ? (
              <div className="listing-output">
                <div className="listing-top-row">
                  <div className="listing-platform-badge">
                    <span>✦</span>
                    <span>{platform}</span>
                  </div>
                  {outputObj.suggested_price && (
                    <div className="listing-price">
                      <span className="price-label">Suggested</span>
                      <span>{outputObj.suggested_price}</span>
                    </div>
                  )}
                </div>

                <div className="listing-section">
                  <div className="listing-section-header">
                    <span className="listing-section-label">📋 Title</span>
                    <button
                      type="button"
                      className="inline-copy-btn"
                      onClick={() => copyToClipboard(outputObj.title, 'title')}
                    >
                      {copiedKey === 'title' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="listing-title-text">{outputObj.title}</p>
                </div>

                <hr className="listing-divider" />

                <div className="listing-section">
                  <div className="listing-section-header">
                    <span className="listing-section-label">📝 Description</span>
                    <button
                      type="button"
                      className="inline-copy-btn"
                      onClick={() => copyToClipboard(outputObj.description, 'desc')}
                    >
                      {copiedKey === 'desc' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="listing-description-text">{outputObj.description}</p>
                </div>

                {Array.isArray(outputObj.tags) && outputObj.tags.length > 0 && (
                  <>
                    <hr className="listing-divider" />
                    <div className="listing-section">
                      <div className="listing-section-header">
                        <span className="listing-section-label">🏷️ Tags</span>
                        <button
                          type="button"
                          className="inline-copy-btn"
                          onClick={() => copyToClipboard(outputObj.tags.map(t => `#${t}`).join(' '), 'tags')}
                        >
                          {copiedKey === 'tags' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="listing-tags">
                        {outputObj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="listing-tag"
                            onClick={() => copyToClipboard(`#${tag}`, `tag-${tag}`)}
                            title="Click to copy"
                            style={{ cursor: 'pointer' }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {outputObj.tip && (
                  <>
                    <hr className="listing-divider" />
                    <div className="listing-section">
                      <span className="listing-section-label">💡 Platform Tip</span>
                      <div className="listing-tip-box" style={{ marginTop: 8 }}>
                        <p className="listing-tip-text">{outputObj.tip}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="listing-footer-actions">
                  <button type="button" className="regen-btn" onClick={handleRegenerate} disabled={loading}>
                    ↺ Regenerate
                  </button>
                  <button type="button" className="secondary-sm-btn" onClick={exportHistory} disabled={history.length === 0}>
                    Export History
                  </button>
                </div>
              </div>
            ) : (
              <div className="output-empty-state">
                <span className="empty-icon">✦</span>
                <p>Fill in the form and click <strong>Generate listing</strong> — your AI-crafted result will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── History Panel ─────────────────────────────────────── */}
        <section id="history-panel" className="panel" style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Listing History</h2>
            {history.length > 0 && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }} onClick={exportHistory}>
                  ↓ Export JSON
                </button>
                <button type="button" className="secondary" style={{ fontSize: '0.82rem', padding: '6px 14px', color: '#f87171' }} onClick={clearHistory}>
                  🗑 Clear
                </button>
              </div>
            )}
          </div>

          {history.length === 0 ? (
            <div className="output-empty-state" style={{ padding: '32px 20px' }}>
              <span className="empty-icon">📋</span>
              <p>No listings saved yet. Generate your first listing above.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.slice().reverse().map((entry, i) => {
                const out = typeof entry.output === 'object' ? entry.output : null;
                const date = entry.createdAt ? new Date(entry.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '';
                return (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(99,102,241,0.05)',
                      border: '1px solid rgba(99,102,241,0.14)',
                      borderRadius: 14,
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.18)', color: '#c7d2fe', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
                            {entry.platform || 'eBay'}
                          </span>
                          {date && <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{date}</span>}
                        </div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {out?.title || entry.itemName || 'Untitled listing'}
                        </p>
                        {out?.suggested_price && (
                          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#a5b4fc' }}>{out.suggested_price}</p>
                        )}
                        {out?.description && (
                          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#94a3b8', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {out.description}
                          </p>
                        )}
                        {Array.isArray(out?.tags) && out.tags.length > 0 && (
                          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {out.tags.slice(0, 5).map((t) => (
                              <span key={t} style={{ fontSize: '0.72rem', background: 'rgba(99,102,241,0.13)', color: '#c7d2fe', borderRadius: 5, padding: '2px 7px' }}>#{t}</span>
                            ))}
                            {out.tags.length > 5 && <span style={{ fontSize: '0.72rem', color: '#64748b' }}>+{out.tags.length - 5} more</span>}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="inline-copy-btn"
                        onClick={() => out && copyToClipboard(buildFullListing(out), `hist-${i}`)}
                        style={{ flexShrink: 0, marginTop: 2 }}
                      >
                        {copiedKey === `hist-${i}` ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
