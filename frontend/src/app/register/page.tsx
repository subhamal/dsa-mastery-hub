'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoadingState(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 min-h-screen">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-lg shadow-2xl">
        <div className="text-center">
          <span className="text-4xl font-extrabold text-blue-500 font-mono">⚡</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">Create a new account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              sign in to existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center font-mono">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="user-name" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                id="user-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loadingState}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all font-mono"
            >
              {loadingState ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
