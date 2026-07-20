import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const redirectTo = `${window.location.origin}/confirm`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {sent ? (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📬</div>
            <h1>Check your inbox</h1>
            <p>We've sent a password reset link to <strong style={{ color: '#e2d4ff' }}>{email}</strong>. Click the link in the email to set a new password.</p>
            <div style={{ marginTop: 24 }}>
              <p className="auth-switch">
                <Link to="/login">← Back to sign in</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1>Reset password</h1>
            <p>Enter the email address you signed up with and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit}>
              <label>
                Email address
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              {error && <div className="message error">{error}</div>}
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </div>
              <p className="auth-switch">
                Remembered it? <Link to="/login">Sign in</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
