'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Visualizer from '@/components/Visualizer';
import { CheckCircle, Bookmark, Save, ArrowLeft, ArrowRight, Play, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ConceptDetails() {
  const { slug } = useParams();
  const router = useRouter();
  const [concept, setConcept] = useState<any>(null);
  const [userNotes, setUserNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchConcept = async () => {
    try {
      const data = await api.get(`/concepts/${slug}`);
      setConcept(data.concept);
      setUserNotes(data.concept.userNotes || '');
    } catch (err) {
      console.error('Failed to load concept details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchConcept();
    }
  }, [slug]);

  const handleToggleComplete = async () => {
    if (!concept) return;
    const newStatus = concept.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    try {
      await api.post(`/concepts/${concept.id}/complete`, { status: newStatus });
      setConcept({ ...concept, status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!concept) return;
    const newBookmarked = !concept.bookmarked;
    try {
      await api.post(`/concepts/${concept.id}/complete`, { bookmarked: newBookmarked });
      setConcept({ ...concept, bookmarked: newBookmarked });
    } catch (err) {
      console.error('Failed to update bookmark:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!concept) return;
    setSavingNotes(true);
    try {
      await api.post(`/concepts/${concept.id}/complete`, { notes: userNotes });
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-red-400">Concept not found.</h2>
        <Link href="/roadmap" className="text-blue-400 hover:underline mt-2 inline-block">Back to Roadmap</Link>
      </div>
    );
  }

  // Deduce visualizer type
  let visualizerType = 'arrays';
  const cSlug = concept.slug.toLowerCase();
  if (cSlug.includes('arrays')) visualizerType = 'arrays';
  else if (cSlug.includes('string')) visualizerType = 'searching';
  else if (cSlug.includes('list')) visualizerType = 'linked-lists';
  else if (cSlug.includes('stack') || cSlug.includes('queue') || cSlug.includes('deque')) visualizerType = 'stack-queue';
  else if (cSlug.includes('tree') || cSlug.includes('bst') || cSlug.includes('heap')) visualizerType = 'trees';
  else if (cSlug.includes('graph') || cSlug.includes('dfs') || cSlug.includes('bfs')) visualizerType = 'graphs';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Back Button & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/roadmap')}
            className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Back to Roadmap"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{concept.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Topic Details & Dynamic Learning Sandbox</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
              concept.bookmarked
                ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${concept.bookmarked ? 'fill-blue-400' : ''}`} />
            <span>Bookmark</span>
          </button>

          <button
            onClick={handleToggleComplete}
            className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all ${
              concept.status === 'COMPLETED'
                ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
                : 'bg-blue-600 border-transparent text-white hover:bg-blue-500'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            <span>{concept.status === 'COMPLETED' ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Notes, Complexity, applications, mistakes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Visual Interactive Sandbox */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 font-mono">Interactive Visual Simulator</h2>
            <Visualizer type={visualizerType} />
          </div>

          {/* Theory notes */}
          <div className="prose prose-invert max-w-none bg-slate-900/10 rounded-2xl border border-white/5 p-6 shadow">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-2">Theory & Details</h2>
            {/* Hardcoded Markdown renderer fallback */}
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {concept.notes}
            </div>
          </div>

          {/* Time & Space Complexity */}
          <div className="bg-slate-900/10 rounded-2xl border border-white/5 p-6 shadow">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-2">Complexity Analysis</h2>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-mono bg-slate-950/60 p-4 rounded-xl border border-white/5">
              {concept.complexityAnalysis}
            </div>
          </div>

          {/* Applications & Errors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-slate-900/20 p-5">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wider text-blue-400">Real-world Applications</h3>
              <p className="text-xs text-slate-300 mt-3 whitespace-pre-line leading-relaxed">{concept.realWorldApps}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/20 p-5">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wider text-red-400">Common Pitfalls</h3>
              <p className="text-xs text-slate-300 mt-3 whitespace-pre-line leading-relaxed">{concept.commonMistakes}</p>
            </div>
          </div>

          {/* Interview tips */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-r from-slate-900 to-indigo-950/40 p-5">
            <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wider text-purple-400">Interview Mastery Tips</h3>
            <p className="text-xs text-slate-300 mt-3 whitespace-pre-line leading-relaxed">{concept.interviewTips}</p>
          </div>
        </div>

        {/* Right Sidebar: Questions, Notes Editor, Interview Questions */}
        <div className="space-y-6">
          {/* Practice Questions list */}
          <div className="rounded-xl border border-white/10 bg-slate-900/20 p-6">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">Practice Problems</h3>
            <div className="mt-4 space-y-3">
              {concept.questions.map((q: any) => (
                <Link
                  key={q.id}
                  href={`/problems/${q.slug}`}
                  className="flex justify-between items-center p-3 rounded-lg bg-slate-950/60 hover:bg-slate-950 transition-colors border border-white/5 hover:border-blue-500/20 group/q"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate group-hover/q:text-white transition-colors">{q.title}</p>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 block uppercase">{q.difficulty} • ACC: {q.acceptanceRate}%</span>
                  </div>
                  <Play className="h-3.5 w-3.5 text-slate-600 group-hover/q:text-blue-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Personal Notes Editor */}
          <div className="rounded-xl border border-white/10 bg-slate-900/20 p-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">My Study Notes</h3>
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-500 px-2 py-1 text-[10px] font-semibold text-white transition-colors font-mono"
              >
                <Save className="h-3 w-3" />
                <span>{savingNotes ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              className="w-full h-32 rounded-lg border border-white/10 bg-slate-950/50 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors resize-none font-mono"
              placeholder="Jot down notes, formulas, or tricky cases..."
            />
          </div>

          {/* Conceptual interview questions */}
          <div className="rounded-xl border border-white/10 bg-slate-900/20 p-6">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">Interview Flashcards</h3>
            <div className="mt-4 space-y-4 max-h-60 overflow-y-auto pr-1">
              {concept.interviewQuestions.map((iq: any) => (
                <div key={iq.id} className="p-3 rounded-lg bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">{iq.company}</span>
                    <span className="text-[9px] font-mono text-slate-500">Freq: {iq.frequency}/5</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-200">{iq.title}</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-900/30 p-2 rounded border border-white/5 font-mono">{iq.questionText}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
