import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data?.session) {
      navigate('/dashboard');
    } else {
      navigate('/login', {
        state: {
          message: 'Account created. Check your email to confirm before logging in.',
        },
      });
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p>Start using ListMate to build listing titles, descriptions, and pricing suggestions faster.</p>
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
          <label>
            Password
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          <p className="input-note">Use an email you can access. Passwords must be at least 6 characters.</p>
          {error && <div className="message error">{error}</div>}
          {message && <div className="message">{message}</div>}
          <div className="form-actions">
            <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
          </div>
          <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
