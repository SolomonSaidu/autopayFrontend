import React, { useState } from 'react';
import { loginUser } from '../services/apiEndpoints';
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ onSuccess, onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser({ email, password });
      onSuccess(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl font-sans text-zinc-100">
      <div className="space-y-1 mb-6 text-center">
        <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
        <p className="text-xs text-zinc-400">Log in to your account to continue.</p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white transition-all"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 pl-9 pr-10 text-xs bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-zinc-50 text-zinc-950 text-xs font-bold rounded-xl hover:bg-white active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shadow-sm mt-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log In"}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
        <button 
          onClick={onSwitchToSignUp}
          className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
}
