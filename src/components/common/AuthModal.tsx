import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        const result = await login(email, password);
        if (!result.success) {
          setErrorMessage(result.error || 'Invalid credentials.');
        } else {
          setIsAuthModalOpen(false);
          setEmail('');
          setPassword('');
        }
      } else {
        const result = await register(name, email, password);
        if (!result.success) {
          setErrorMessage(result.error || 'Registration failed.');
        } else {
          setIsAuthModalOpen(false);
          setName('');
          setEmail('');
          setPassword('');
        }
      }
    } catch {
      setErrorMessage('Network or server connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await login('alexander@nexusflow.io', 'Password123!');
      if (res.success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMessage(res.error || 'Demo login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-white text-base">AIPilot.art</span>
        </div>

        <h2 className="text-xl font-black text-white tracking-tight">
          {authModalMode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          {authModalMode === 'login'
            ? 'Access your saved brand profiles, active campaigns, and marketing telemetry.'
            : 'Start with your own isolated brand intelligence workspace and AI marketing department.'}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {authModalMode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Ellis"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <span>{authModalMode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* 1-Click Demo Login Helper for Testing / Audit */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Sign in as Demo Owner (Alexander Vance)</span>
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {authModalMode === 'login' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('register');
                  setErrorMessage(null);
                }}
                className="text-indigo-400 hover:underline font-bold"
              >
                Create Account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setErrorMessage(null);
                }}
                className="text-indigo-400 hover:underline font-bold"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
