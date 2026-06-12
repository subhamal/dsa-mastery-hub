'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Shield, Flame, Star, Award, Compass, Wand2, Crown, Bot } from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const lbData = await api.get('/leaderboard');
        setLeaderboard(lbData.leaderboard || []);

        const statsData = await api.get('/user/stats');
        setBadges(statsData.badges || []);
      } catch (err) {
        console.error('Failed to load leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Helper to map badge icons
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'lucide-award':
        return <Award className="h-6 w-6 text-indigo-400" />;
      case 'lucide-flame':
        return <Flame className="h-6 w-6 text-orange-400" />;
      case 'lucide-compass':
        return <Compass className="h-6 w-6 text-blue-400" />;
      case 'lucide-wand-2':
        return <Wand2 className="h-6 w-6 text-purple-400" />;
      case 'lucide-crown':
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 'lucide-bot':
        return <Bot className="h-6 w-6 text-emerald-400" />;
      default:
        return <Star className="h-6 w-6 text-blue-400" />;
    }
  };

  const badgeMap = new Map(badges.map(b => [b.name, true]));

  // Standard available badges
  const allBadgesList = [
    { name: 'DSA Novice', description: 'Begin your DSA journey and earn your first 10 XP!', icon: 'lucide-award' },
    { name: 'Consistent Coder', description: 'Unlock this by achieving a 3-day daily streak!', icon: 'lucide-flame' },
    { name: 'Algorithm Explorer', description: 'Acquire a total of 100 XP from solving problems.', icon: 'lucide-compass' },
    { name: 'Data Structure Wizard', description: 'Demonstrate Mastery in core DS concepts by earning 500 XP.', icon: 'lucide-wand-2' },
    { name: 'Coding Grandmaster', description: 'Reach the pinnacle of competitive DSA with 1000 XP!', icon: 'lucide-crown' },
    { name: 'AI Apprentice', description: 'Engage the AI Tutor for assistance across 5 problems.', icon: 'lucide-bot' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
      
      {/* Left: Leaderboard rankings */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500 fill-yellow-500/10" /> Global Leaderboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Compete with students worldwide. Gain XP by completing concepts and coding challenges.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/10 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/40 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                <th className="px-6 py-4 w-20 text-center font-mono">Rank</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4 text-center font-mono">Streak</th>
                <th className="px-6 py-4 text-right font-mono">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {leaderboard.map((u) => {
                const isCurrentUser = user?.id === u.id;
                const rankColor =
                  u.rank === 1
                    ? 'text-yellow-400 font-bold'
                    : u.rank === 2
                    ? 'text-slate-300 font-bold'
                    : u.rank === 3
                    ? 'text-amber-600 font-bold'
                    : 'text-slate-400';

                return (
                  <tr key={u.id} className={`transition-colors ${isCurrentUser ? 'bg-blue-600/10' : 'hover:bg-white/[0.01]'}`}>
                    <td className={`px-6 py-4 text-center font-mono ${rankColor}`}>
                      {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="h-8 w-8 rounded-full border border-white/10 bg-slate-800" />
                        <span className={`font-semibold ${isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                          {u.name} {isCurrentUser && <span className="text-[10px] font-mono font-bold uppercase bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 ml-2">YOU</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-orange-400 font-bold text-xs">
                        <Flame className="h-4 w-4 fill-orange-400/20" />
                        <span>{u.streak}d</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-white pr-8">{u.xp} XP</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Badges List */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shield className="h-6.5 w-6.5 text-indigo-400 fill-indigo-500/10" /> Trophy Showcase
          </h2>
          <p className="text-slate-400 text-xs mt-1">Unlock badges by hitting study levels and coding frequency triggers.</p>
        </div>

        <div className="space-y-4">
          {allBadgesList.map((badge) => {
            const hasBadge = badgeMap.has(badge.name);
            return (
              <div
                key={badge.name}
                className={`rounded-xl border p-4 flex gap-4 transition-all duration-300 ${
                  hasBadge
                    ? 'border-indigo-500/20 bg-indigo-950/20 shadow-md shadow-indigo-500/5'
                    : 'border-white/5 bg-slate-950/20 opacity-40 select-none'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${
                  hasBadge ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-slate-950 border-white/10'
                }`}>
                  {getBadgeIcon(badge.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    {hasBadge && (
                      <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1 py-0.5 text-[8px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Unlocked</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
