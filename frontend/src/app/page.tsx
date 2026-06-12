'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Flame, Trophy, Calendar, Sparkles, CheckCircle, ArrowRight, Brain } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [revisionItems, setRevisionItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await api.get('/user/stats');
        setStats(statsData);

        const revData = await api.get('/revision');
        setRevisionItems(revData.revisionItems || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const badges = stats?.badges || [];

  return (
    <div className="space-y-8">
      {/* Welcome & Streak Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-900/30 to-slate-900/20 p-6 rounded-2xl border border-white/5 shadow-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Welcome back, {user?.name}! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Ready to solve today\'s coding challenges? Keep your streak burning!</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-950/60 px-5 py-3 rounded-xl border border-white/10 w-fit">
          <Flame className="h-8 w-8 text-orange-500 fill-orange-500 animate-pulse" />
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Daily Streak</p>
            <p className="text-2xl font-black text-white mt-1">{stats?.streak || 0} Day{stats?.streak !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5 backdrop-blur-sm shadow flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total XP Earned</p>
            <p className="text-xl font-bold mt-1 text-white">{stats?.xp || 0} XP</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5 backdrop-blur-sm shadow flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Problems Solved</p>
            <p className="text-xl font-bold mt-1 text-white">{stats?.questionsSolved || 0} Solved</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5 backdrop-blur-sm shadow flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Concepts Learnt</p>
            <p className="text-xl font-bold mt-1 text-white">{stats?.conceptsCompleted || 0} Completed</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/30 p-5 backdrop-blur-sm shadow flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Badges</p>
            <p className="text-xl font-bold mt-1 text-white">{badges.length} Badges</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recommended + Revision */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily AI Problem */}
          <div className="rounded-xl border border-blue-500/20 bg-slate-950 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 bg-blue-500/10 text-blue-400 rounded-bl-xl border-l border-b border-blue-500/20">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Daily Challenge Recommendation
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-lg leading-relaxed">
              Master sliding windows today! We recommend trying the **Arrays Challenge Optimization** problem to lock in your O(N) array patterns.
            </p>
            <Link
              href="/problems/arrays-rotate-array-by-k-positions-q2"
              className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors w-fit group"
            >
              Solve Challenge <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Revision Planner Card */}
          <div className="rounded-xl border border-white/10 bg-slate-900/20 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Spaced Repetition Revision Planner
            </h3>
            <p className="text-xs text-slate-400 mt-1">Due problems calculated using SuperMemo-2 algorithms based on your quality rating.</p>
            
            {revisionItems.length === 0 ? (
              <div className="mt-6 text-center py-8 border border-dashed border-white/5 rounded-xl bg-slate-950/20">
                <CheckCircle className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400 mt-2 font-mono">No revisions scheduled for today!</p>
                <p className="text-xs text-slate-500 mt-1">Complete questions and select a quality rating to schedule revisions.</p>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-white/5 max-h-60 overflow-y-auto pr-2">
                {revisionItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center py-3">
                    <div>
                      <p className="text-sm font-bold text-white">{item.question.title}</p>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{item.question.difficulty}</span>
                    </div>
                    <Link
                      href={`/problems/${item.question.slug}`}
                      className="rounded bg-blue-600 hover:bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white transition-all font-mono"
                    >
                      Revise
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Badges Showcase & Quick Links */}
        <div className="space-y-6">
          {/* Earned Badges */}
          <div className="rounded-xl border border-white/10 bg-slate-900/20 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white">Earned Badges ({badges.length})</h3>
            
            {badges.length === 0 ? (
              <p className="text-sm text-slate-500 mt-4 text-center">Solve problems and earn XP to unlock badges!</p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {badges.map((b: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-950/50 border border-white/5 text-center group hover:border-blue-500/30 transition-colors" title={b.description}>
                    <div className="p-2 bg-blue-500/10 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 mt-2 truncate w-full">{b.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick AI Hub Links */}
          <div className="rounded-xl border border-white/10 bg-slate-900/20 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white">AI Learning Assistants</h3>
            <div className="mt-4 space-y-3">
              <Link
                href="/ai-hub"
                className="flex justify-between items-center p-3 rounded-lg bg-slate-950 hover:bg-slate-900 transition-colors border border-white/5 font-mono text-xs"
              >
                <span>💬 AI DSA Tutor Chat</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </Link>
              <Link
                href="/ai-hub?tool=interview"
                className="flex justify-between items-center p-3 rounded-lg bg-slate-950 hover:bg-slate-900 transition-colors border border-white/5 font-mono text-xs"
              >
                <span>🎙️ AI Interview Simulator</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </Link>
              <Link
                href="/ai-hub?tool=roadmap"
                className="flex justify-between items-center p-3 rounded-lg bg-slate-950 hover:bg-slate-900 transition-colors border border-white/5 font-mono text-xs"
              >
                <span>🗺️ Custom Roadmap Maker</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
