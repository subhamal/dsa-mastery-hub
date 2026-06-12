'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Code2, Bot, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'DSA Roadmap', href: '/roadmap', icon: Map },
    { name: 'Practice Problems', href: '/problems', icon: Code2 },
    { name: 'AI Hub Tools', href: '/ai-hub', icon: Bot },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy }
  ];

  if (!user) return null;

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-950/40 text-slate-400 hidden md:block">
      <div className="flex h-full flex-col justify-between p-4">
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                    : 'hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Small footer card */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/80 p-4 border border-white/5 text-center shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Current Goal</p>
          <p className="text-sm font-bold text-white mt-1">FAANG Prep Mode</p>
          <div className="mt-3 overflow-hidden rounded-full bg-slate-800 h-2">
            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">15 / 33 Days Completed</p>
        </div>
      </div>
    </aside>
  );
}
