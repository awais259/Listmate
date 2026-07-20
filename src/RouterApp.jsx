import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import EmailConfirm from './EmailConfirm';
import Settings from './Settings';
import Pricing from './Pricing';
import Terms from './Terms';
import Privacy from './Privacy';
import Contact from './Contact';
import Refund from './Refund';
import NotFound from './NotFound';
import { AuthProvider, useAuth } from './AuthProvider';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-shell">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>⚡</div>
          <p>Checking your session…</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function RouterApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm" element={<EmailConfirm />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refund" element={<Refund />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><App /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
