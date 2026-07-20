/**
 * supabaseClient.js
 *
 * When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present → uses the real
 * Supabase JS client (production mode).
 *
 * When the env vars are missing → falls back to a localStorage-backed mock that
 * makes the full auth flow (signup / login / signout / session restore) work
 * locally without any server connection (demo mode).
 *
 * To connect to Supabase:
 *   1. Create a .env file in the project root (copy .env.example)
 *   2. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 *   3. Restart the dev server
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const USE_REAL_SUPABASE = !!(supabaseUrl && supabaseAnonKey);

// ── Real Supabase client (production) ────────────────────────────────────────
const realClient = USE_REAL_SUPABASE
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── Local mock client (demo / dev without Supabase) ──────────────────────────
const STORAGE_KEY = 'listmate_demo_user';

/** Returns a fake user-shaped object. */
function fakeUser(email) {
  return {
    id: `demo-${email.replace(/[^a-z0-9]/gi, '-')}`,
    email,
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    role: 'authenticated',
  };
}

/** Minimal in-memory store of auth state change listeners. */
const _listeners = new Set();
let _currentSession = null;

function _loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return { user, access_token: 'demo-token', refresh_token: 'demo-refresh' };
  } catch {
    return null;
  }
}

function _saveSession(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  _currentSession = user ? { user, access_token: 'demo-token', refresh_token: 'demo-refresh' } : null;
  _listeners.forEach((fn) => fn('SIGNED_' + (user ? 'IN' : 'OUT'), _currentSession));
}

// Initialise session from storage on load
_currentSession = _loadSession();

const mockAuth = {
  /** Returns current session (Promise). */
  getSession: () =>
    Promise.resolve({ data: { session: _currentSession }, error: null }),

  /** Sign in with email + password (any password accepted in demo mode). */
  signInWithPassword: ({ email, password }) => {
    if (!email || !password) {
      return Promise.resolve({ data: null, error: { message: 'Email and password are required.' } });
    }
    if (password.length < 6) {
      return Promise.resolve({ data: null, error: { message: 'Password must be at least 6 characters.' } });
    }
    const user = fakeUser(email);
    _saveSession(user);
    return Promise.resolve({ data: { user, session: _currentSession }, error: null });
  },

  /** Sign up (creates a demo account instantly — no email confirmation). */
  signUp: ({ email, password }) => {
    if (!email || !password) {
      return Promise.resolve({ data: null, error: { message: 'Email and password are required.' } });
    }
    if (password.length < 6) {
      return Promise.resolve({ data: null, error: { message: 'Password must be at least 6 characters.' } });
    }
    const user = fakeUser(email);
    _saveSession(user);
    return Promise.resolve({ data: { user, session: _currentSession }, error: null });
  },

  /** Sign out — clears localStorage. */
  signOut: () => {
    _saveSession(null);
    return Promise.resolve({ error: null });
  },

  /** Subscribe to auth state changes. */
  onAuthStateChange: (callback) => {
    _listeners.add(callback);
    // Fire immediately with the current state
    setTimeout(() => callback(_currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', _currentSession), 0);
    return {
      data: {
        subscription: {
          unsubscribe: () => _listeners.delete(callback),
        },
      },
    };
  },
};

const mockClient = { auth: mockAuth };

// ── Exported client ───────────────────────────────────────────────────────────
export const supabase = USE_REAL_SUPABASE ? realClient : mockClient;

if (!USE_REAL_SUPABASE) {
  console.info(
    '%c[ListMate] Running in DEMO mode — auth is local-only.\n' +
    'To connect Supabase: copy .env.example → .env and fill in your credentials.',
    'color: #a78bfa; font-weight: bold;'
  );
}
