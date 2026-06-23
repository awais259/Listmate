import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import { AuthProvider, useAuth } from './AuthProvider';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><App /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
