import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 font-sans text-white flex flex-col items-center justify-center px-6 text-center">
      <LogoMark size={56} />
      <p className="mt-8 text-8xl font-bold text-indigo-500/30">404</p>
      <h1 className="mt-4 text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-white/50 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <div className="mt-10 flex gap-4">
        <Link
          to="/"
          className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-7 py-3 text-sm font-semibold text-white hover:shadow-xl hover:shadow-indigo-500/40 transition"
        >
          Back to home
        </Link>
        <Link
          to="/dashboard"
          className="rounded-full border border-indigo-500/40 bg-white/5 px-7 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:border-indigo-400/60 transition"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
