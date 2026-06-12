'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Flame, Award, LogOut, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-md text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            <span className="text-2xl font-black text-blue-400 font-mono">⚡</span>
            DSA Mastery Hub
          </Link>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Streak Counter */}
              <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-400 border border-orange-500/20">
                <Flame className="h-4 w-4 fill-orange-400 animate-pulse" />
                <span>{user.streak} Day{user.streak !== 1 ? 's' : ''}</span>
              </div>

              {/* XP Gauge */}
              <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400 border border-blue-500/20">
                <Award className="h-4 w-4" />
                <span>{user.xp} XP</span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title="Toggle Dark/Light Mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Profile info */}
              <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-blue-400 bg-slate-800"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold leading-none text-slate-200">{user.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                </div>
                
                <button
                  onClick={logout}
                  className="rounded-full p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
