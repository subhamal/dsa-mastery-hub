'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    // Sync dark mode style class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [user, loading, isAuthPage, router]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-400 font-mono">Initializing DSA Hub...</p>
        </div>
      </div>
    );
  }

  if (!user && !isAuthPage) {
    return null; // Prevents flashing content before redirect
  }

  if (isAuthPage) {
    return <div className="min-h-screen bg-slate-950 text-white flex flex-col">{children}</div>;
  }

  return (
    <div className={`flex min-h-screen flex-col ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
