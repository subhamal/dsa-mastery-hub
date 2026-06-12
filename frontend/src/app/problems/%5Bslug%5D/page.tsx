'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import CodeEditor from '@/components/CodeEditor';
import { ArrowLeft, Bookmark, CheckCircle, AlertTriangle, Sparkles, Send, Play } from 'lucide-react';
import Link from 'next/link';

export default function ProblemWorkspace() {
  const { slug } = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Editor states
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  // Tab selections
  const [leftTab, setLeftTab] = useState('description'); // 'description', 'solution', 'complexity'
  const [solutionTab, setSolutionTab] = useState('optimal'); // 'brute', 'better', 'optimal'

  // AI helper panel states
  const [aiTab, setAiTab] = useState(''); // '', 'hint', 'review', 'tutor'
  const [aiMessage, setAiMessage] = useState('');
  const [aiLogs, setAiLogs] = useState<{ role: string; message: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Test run states
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [showRater, setShowRater] = useState(false);
  const [ratedMsg, setRatedMsg] = useState('');

  const fetchProblem = async () => {
    try {
      const res = await api.get(`/questions/${slug}`);
      setProblem(res.question);
      
      // Auto-set javascript template initially
      const templates = res.question.codeTemplates;
      setCode(res.question.userCode || templates.javascript || '');
      if (res.question.userLanguage) {
        setLanguage(res.question.userLanguage);
        setCode(res.question.userCode || templates[res.question.userLanguage] || '');
      }
    } catch (err) {
      console.error('Failed to load problem:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProblem();
    }
  }, [slug]);

  // Handle language switch
  const handleLanguageChange = (newLang: string) => {
    if (!problem) return;
    setLanguage(newLang);
    const templates = problem.codeTemplates;
    setCode(templates[newLang] || '');
  };

  const handleToggleBookmark = async () => {
    if (!problem) return;
    try {
      const newBookmarked = !problem.isBookmarked;
      await api.post(`/questions/${problem.id}/bookmark`, { bookmarked: newBookmarked });
      setProblem({ ...problem, isBookmarked: newBookmarked });
    } catch (err) {
      console.error('Failed to bookmark:', err);
    }
  };

  // Submit code
  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitting(true);
    setRunResult(null);
    setShowRater(false);
    try {
      const res = await api.post(`/questions/${problem.id}/submit`, { code, language });
      setRunResult(res);
      if (res.success) {
        setShowRater(true);
      }
    } catch (err: any) {
      setRunResult({ success: false, errorMessage: err.message || 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Revision rating schedule
  const handleRateRevision = async (quality: number) => {
    if (!problem) return;
    try {
      await api.post('/revision', { questionId: problem.id, quality });
      setRatedMsg(`Scheduled revision! Interval scheduled via SM-2.`);
      setTimeout(() => setShowRater(false), 2000);
    } catch (err) {
      console.error('Failed to schedule revision:', err);
    }
  };

  // AI Hint
  const handleRequestAiHint = async () => {
    if (!problem) return;
    setAiTab('hint');
    setAiLoading(true);
    try {
      const res = await api.post('/ai/hint', { questionId: problem.id, currentCode: code });
      setAiLogs([{ role: 'assistant', message: res.hint }]);
    } catch (err: any) {
      setAiLogs([{ role: 'assistant', message: `AI Coach: ${err.message || 'Hint generation failed.'}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Code Review
  const handleRequestCodeReview = async () => {
    if (!problem) return;
    setAiTab('review');
    setAiLoading(true);
    try {
      const res = await api.post('/ai/review', { questionId: problem.id, code, language });
      setAiLogs([{ role: 'assistant', message: res.review }]);
    } catch (err: any) {
      setAiLogs([{ role: 'assistant', message: `AI Coach: ${err.message || 'Code review failed.'}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Chat Tutor
  const handleSendMessageToTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim() || !problem) return;

    const userMsg = aiMessage;
    setAiMessage('');
    setAiLogs(prev => [...prev, { role: 'user', message: userMsg }]);
    setAiLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: `Problem Context: ${problem.title}.\nQuestion: ${userMsg}` });
      setAiLogs(prev => [...prev, { role: 'assistant', message: res.reply }]);
    } catch (err: any) {
      setAiLogs(prev => [...prev, { role: 'assistant', message: `Tutor Error: ${err.message || 'Unable to connect.'}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-red-400">Problem not found.</h2>
        <Link href="/problems" className="text-blue-400 hover:underline mt-2 inline-block">Back to Problems</Link>
      </div>
    );
  }

  const diffColor =
    problem.difficulty === 'EASY'
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : problem.difficulty === 'MEDIUM'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-red-400 bg-red-500/10 border-red-500/20';

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto h-[calc(100vh-100px)] overflow-hidden">
      {/* Top action header */}
      <div className="flex justify-between items-center shrink-0 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/roadmap/${problem.concept.slug}`)}
            className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Back to Concept Theory"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">{problem.title}</h1>
            <span className="text-[10px] text-slate-400 font-mono">Concept Area: {problem.concept.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleBookmark}
            className={`rounded-lg border p-2 text-slate-400 hover:text-white transition-colors ${
              problem.isBookmarked ? 'bg-blue-600/15 border-blue-500 text-blue-400' : 'bg-slate-900 border-white/10'
            }`}
            title="Bookmark Problem"
          >
            <Bookmark className={`h-4 w-4 ${problem.isBookmarked ? 'fill-blue-400' : ''}`} />
          </button>
          
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="rounded-lg border border-white/10 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        
        {/* Left Panel: Details tabs */}
        <div className="w-full md:w-1/2 flex flex-col border border-white/10 bg-slate-900/10 rounded-2xl min-h-0">
          {/* Tab buttons */}
          <div className="flex border-b border-white/10 bg-slate-950/40 text-xs font-mono font-bold uppercase tracking-wider shrink-0 rounded-t-2xl">
            <button
              onClick={() => setLeftTab('description')}
              className={`flex-1 py-3 text-center border-r border-white/10 rounded-tl-2xl ${
                leftTab === 'description' ? 'bg-slate-900/50 text-blue-400 border-b-2 border-b-blue-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setLeftTab('solution')}
              className={`flex-1 py-3 text-center border-r border-white/10 ${
                leftTab === 'solution' ? 'bg-slate-900/50 text-blue-400 border-b-2 border-b-blue-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Solutions
            </button>
            <button
              onClick={() => setLeftTab('complexity')}
              className={`flex-1 py-3 text-center rounded-tr-2xl ${
                leftTab === 'complexity' ? 'bg-slate-900/50 text-blue-400 border-b-2 border-b-blue-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Complexities
            </button>
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0 text-sm">
            {leftTab === 'description' && (
              <div className="space-y-6">
                {/* Meta details */}
                <div className="flex gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${diffColor}`}>
                    {problem.difficulty}
                  </span>
                  <span className="rounded-full bg-slate-800 border border-white/5 px-2.5 py-0.5 text-[9px] text-slate-400 font-mono">
                    Estimated Time: {problem.estimatedTime}m
                  </span>
                  <span className="rounded-full bg-slate-800 border border-white/5 px-2.5 py-0.5 text-[9px] text-slate-400 font-mono">
                    Acceptance: {problem.acceptanceRate}%
                  </span>
                </div>

                {/* Problem Statement */}
                <div className="text-slate-300 leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                  {problem.problemStatement}
                </div>

                {/* Hints Block */}
                <div className="border-t border-white/5 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-mono">Question Clues & Hints</h3>
                  <div className="space-y-2.5">
                    {problem.hints.map((h: string, idx: number) => (
                      <details key={idx} className="group border border-white/10 rounded-lg bg-slate-950/40 p-3 outline-none">
                        <summary className="text-xs font-bold text-slate-400 cursor-pointer list-none select-none flex items-center justify-between">
                          <span>Hint {idx + 1}</span>
                          <span className="text-[10px] text-blue-400 font-mono group-open:hidden">Reveal</span>
                          <span className="text-[10px] text-slate-500 font-mono hidden group-open:inline">Hide</span>
                        </summary>
                        <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed">{h}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {leftTab === 'solution' && (
              <div className="space-y-6">
                <div className="flex bg-slate-950 rounded-lg p-1 border border-white/10 text-xs font-mono">
                  {['brute', 'better', 'optimal'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSolutionTab(t)}
                      className={`flex-1 py-1.5 text-center rounded capitalize font-bold ${
                        solutionTab === t ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Code Solution view */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Approach Breakdown</h4>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {solutionTab === 'brute' && problem.bruteForceExplanation}
                      {solutionTab === 'better' && problem.betterExplanation}
                      {solutionTab === 'optimal' && problem.optimalExplanation}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">Code Solution (JavaScript)</h4>
                    <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-white/5 text-slate-300 overflow-x-auto leading-relaxed max-h-60">
                      {solutionTab === 'brute' && problem.bruteForceSolution}
                      {solutionTab === 'better' && problem.betterSolution}
                      {solutionTab === 'optimal' && problem.optimalSolution}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {leftTab === 'complexity' && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Comparison Analysis</h3>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
                  <table className="w-full border-collapse text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-950 font-bold text-slate-400 uppercase">
                        <th className="p-3">Solution Type</th>
                        <th className="p-3">Time Complexity</th>
                        <th className="p-3">Space Complexity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-3 font-bold text-red-400">Brute Force</td>
                        <td className="p-3">{problem.complexityAnalysis.bruteForce?.time}</td>
                        <td className="p-3">{problem.complexityAnalysis.bruteForce?.space}</td>
                      </tr>
                      {problem.complexityAnalysis.better && (
                        <tr>
                          <td className="p-3 font-bold text-amber-400">Better</td>
                          <td className="p-3">{problem.complexityAnalysis.better.time}</td>
                          <td className="p-3">{problem.complexityAnalysis.better.space}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="p-3 font-bold text-emerald-400">Optimal</td>
                        <td className="p-3">{problem.complexityAnalysis.optimal?.time}</td>
                        <td className="p-3">{problem.complexityAnalysis.optimal?.space}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor and AI assist */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0 gap-4">
          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-0 relative">
            <CodeEditor code={code} onChange={(val) => setCode(val || '')} language={language} />
          </div>

          {/* Action buttons (Run & Submit) */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 py-2.5 text-xs font-bold text-white transition-all font-mono"
            >
              <CheckCircle className="h-4 w-4" />
              <span>{submitting ? 'Submitting Code...' : 'Submit Solution'}</span>
            </button>
          </div>

          {/* Test/Submit Results Box */}
          {runResult && (
            <div className={`rounded-xl border p-4 font-mono text-xs shrink-0 ${
              runResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-2 text-sm">
                {runResult.success ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                <span>{runResult.message || 'Run output details'}</span>
              </div>
              {runResult.errorMessage && <p className="text-red-400 whitespace-pre-wrap">{runResult.errorMessage}</p>}
              {runResult.testResults && (
                <div className="mt-2 divide-y divide-white/5 space-y-1">
                  {runResult.testResults.slice(0, 3).map((tr: any) => (
                    <div key={tr.id} className="flex justify-between items-center py-1.5">
                      <span>Test Case {tr.id}: {tr.input}</span>
                      <span className={tr.passed ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {tr.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Spaced Repetition Quality Rater modal/block */}
          {showRater && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 font-mono text-xs shrink-0 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Sparkles className="h-4 w-4 animate-spin-slow" />
                <span>Problem Solved! rate study quality to schedule revision:</span>
              </div>
              {ratedMsg ? (
                <p className="text-emerald-400 text-center font-bold animate-pulse">{ratedMsg}</p>
              ) : (
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => handleRateRevision(stars)}
                      className="rounded bg-indigo-600/40 hover:bg-indigo-600 px-3 py-1.5 border border-indigo-500/20 font-bold hover:scale-105 transition-all text-indigo-300 hover:text-white"
                    >
                      {stars} ★
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-slate-500 text-center leading-none">0: Total blackout, 5: Perfect response. Scheduled via SuperMemo-2 interval mappings.</p>
            </div>
          )}

          {/* Collapsible AI Coach panel */}
          <div className="border border-white/10 rounded-2xl bg-slate-900/30 flex flex-col overflow-hidden max-h-48 shrink-0">
            {/* AI Control Buttons */}
            <div className="flex border-b border-white/5 bg-slate-950/30 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
              <button
                onClick={handleRequestAiHint}
                className={`flex-1 py-2 text-center border-r border-white/5 ${
                  aiTab === 'hint' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                💡 Hint Coach
              </button>
              <button
                onClick={handleRequestCodeReview}
                className={`flex-1 py-2 text-center border-r border-white/5 ${
                  aiTab === 'review' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                🛠️ Review Code
              </button>
              <button
                onClick={() => setAiTab('tutor')}
                className={`flex-1 py-2 text-center ${
                  aiTab === 'tutor' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                💬 Chat Tutor
              </button>
            </div>

            {/* AI Output (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-3.5 text-xs text-slate-300 min-h-0 bg-slate-950/20">
              {aiTab === '' ? (
                <div className="text-center py-4 text-slate-500 font-mono">
                  Need assistance? Choose an AI helper tool above.
                </div>
              ) : aiLoading ? (
                <div className="flex items-center justify-center gap-2 py-4 text-slate-400 font-mono">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border border-blue-500 border-t-transparent"></div>
                  <span>AI Coach analyzing...</span>
                </div>
              ) : (
                <div className="space-y-2 font-mono">
                  {aiLogs.map((log, idx) => (
                    <div key={idx} className={log.role === 'user' ? 'text-blue-400 text-right' : 'text-slate-300 whitespace-pre-wrap'}>
                      <span className="font-bold text-[10px] opacity-60 uppercase">{log.role === 'user' ? 'You' : 'AI Coach'}:</span>
                      <p className="mt-0.5 leading-relaxed">{log.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tutor Chat Input field */}
            {aiTab === 'tutor' && (
              <form onSubmit={handleSendMessageToTutor} className="flex border-t border-white/5 bg-slate-950 px-2.5 py-1.5 shrink-0">
                <input
                  type="text"
                  placeholder="Ask tutor for help..."
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  className="flex-1 bg-transparent text-[11px] outline-none text-white font-mono placeholder-slate-500"
                />
                <button type="submit" className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
