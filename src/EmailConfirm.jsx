import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

/**
 * EmailConfirm handles two cases:
 *  1. Email confirmation after signup  (type=signup in URL hash)
 *  2. Password reset link              (type=recovery in URL hash)
 *
 * Supabase redirects to /confirm#access_token=...&type=signup|recovery
 */
export default function EmailConfirm() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'confirmed' | 'recovery' | 'error'
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function handleConfirm() {
      // Supabase puts the token in the URL hash: #access_token=...&type=...
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const type = params.get('type');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const errorCode = params.get('error_code');
      const errorDesc = params.get('error_description');

      if (errorCode) {
        setError(errorDesc || 'The link is invalid or has expired.');
        setStatus('error');
        return;
      }

      if (!accessToken) {
        setError('No confirmation token found. The link may have expired.');
        setStatus('error');
        return;
      }

      // Set the session from the token in the URL
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      });

      if (sessionError) {
        setError(sessionError.message);
        setStatus('error');
        return;
      }

      if (type === 'recovery') {
        // Password reset flow — show set-new-password form
        setStatus('recovery');
      } else {
        // Email confirmation (signup or email change)
        setStatus('confirmed');
        setTimeout(() => navigate('/dashboard'), 2500);
      }
    }

    handleConfirm();
  }, [navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
            <h1>Verifying…</h1>
            <p>Please wait while we confirm your link.</p>
          </>
        )}

        {status === 'confirmed' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
            <h1>Email confirmed!</h1>
            <p>Your account is verified. Taking you to the dashboard…</p>
          </>
        )}

        {status === 'recovery' && !saved && (
          <>
            <h1>Set new password</h1>
            <p>Choose a strong password for your ListMate account.</p>
            <form onSubmit={handleSetPassword}>
              <label>
                New password
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </label>
              <label>
                Confirm password
                <input
                  type="password"
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </label>
              {error && <div className="message error">{error}</div>}
              <div className="form-actions">
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Set password'}
                </button>
              </div>
            </form>
          </>
        )}

        {status === 'recovery' && saved && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎉</div>
            <h1>Password updated!</h1>
            <p>Your new password is set. Redirecting to dashboard…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>❌</div>
            <h1>Link expired</h1>
            <p>{error}</p>
            <div style={{ marginTop: 24 }}>
              <p className="auth-switch">
                <Link to="/forgot-password">Request a new link</Link> ·{' '}
                <Link to="/login">Sign in</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
