import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@millops.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Invalid email or password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0d0a] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#c9a84c]/10 px-3 py-1 text-xs font-medium text-[#c9a84c]">
            <span role="img" aria-label="wheat">
              🌾
            </span>
            Mill Ops
          </div>
          <h1 className="text-xl font-semibold text-slate-50">
            Sign in to your mill
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Monitor grain intake, throughput, and quality in real time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#c9a84c] px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition-colors hover:bg-[#b4953f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-slate-900/70 px-3 py-3 text-xs text-slate-300">
          <div className="mb-1 font-semibold text-slate-100">
            Demo credentials
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            <div>
              <span className="text-slate-400">Email:</span>{' '}
              <span className="font-mono text-slate-100">
                admin@millops.com
              </span>
            </div>
            <div>
              <span className="text-slate-400">Password:</span>{' '}
              <span className="font-mono text-slate-100">
                admin123
              </span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Use these read-only demo credentials to explore the milling
            dashboard in this portfolio project.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;