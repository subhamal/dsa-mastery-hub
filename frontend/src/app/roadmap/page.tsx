'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { CheckCircle, Lock, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data = await api.get('/roadmap');
        setRoadmap(data);
      } catch (err) {
        console.error('Failed to load roadmap:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const phases = roadmap?.phases || [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Structured DSA Roadmap</h1>
        <p className="text-slate-400 text-sm mt-1">Master programming fundamentals, core structures, and advanced design theories in 13 progressive phases.</p>
      </div>

      {/* Roadmap Tree List */}
      <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-12 py-4">
        {phases.map((phase: any, index: number) => {
          const isCompleted = phase.completedCount === phase.totalConcepts && phase.totalConcepts > 0;
          const isUnlocked = index === 0 || phases[index - 1].completedCount > 0;
          const progressPercentage = phase.totalConcepts > 0 
            ? Math.round((phase.completedCount / phase.totalConcepts) * 100) 
            : 0;

          return (
            <div key={phase.id} className="relative group">
              {/* Phase Connector Circle */}
              <div className={`absolute -left-[45px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                isCompleted
                  ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-md shadow-emerald-500/20'
                  : isUnlocked
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 fill-emerald-500/20" />
                ) : isUnlocked ? (
                  <BookOpen className="h-4 w-4" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Phase Details Box */}
              <div className={`rounded-xl border p-5 backdrop-blur shadow-lg transition-all ${
                isUnlocked
                  ? 'border-white/10 bg-slate-900/30 hover:border-blue-500/30'
                  : 'border-white/5 bg-slate-950/20 opacity-50 select-none'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-blue-400 uppercase tracking-widest leading-none">Phase {phase.order}</span>
                    <h2 className="text-lg font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">{phase.title}</h2>
                  </div>
                  
                  {isUnlocked && (
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-semibold font-mono">{phase.completedCount} / {phase.totalConcepts} completed</p>
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-slate-400 text-xs mt-3 leading-relaxed">{phase.description}</p>

                {/* Concept Grid List */}
                {isUnlocked && (
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t border-white/5 pt-4">
                    {phase.concepts.map((concept: any) => (
                      <Link
                        key={concept.id}
                        href={`/roadmap/${concept.slug}`}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-950/40 p-3 hover:bg-slate-950 hover:border-blue-500/20 transition-all group/item"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle className={`h-4.5 w-4.5 shrink-0 ${
                            concept.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-700'
                          }`} />
                          <span className="text-xs font-semibold text-slate-300 truncate group-hover/item:text-white transition-colors">{concept.title}</span>
                        </div>
                        <ChevronRight className="h-3 w-3 text-slate-600 group-hover/item:text-blue-400 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
