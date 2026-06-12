'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { MessageSquare, Calendar, ShieldAlert, Sparkles, Send } from 'lucide-react';

export default function AiHub() {
  const searchParams = useSearchParams();
  const initialTool = searchParams.get('tool') || 'tutor';

  const [activeTab, setActiveTab] = useState(initialTool);

  // 1. Chatbot state
  const [chatMsg, setChatMsg] = useState('');
  const [chatLogs, setChatLogs] = useState<{ role: string; message: string }[]>([
    { role: 'assistant', message: 'Hello! I am your AI DSA Tutor. Ask me any conceptual or code-related questions. E.g. "Explain BST deletion" or "How does quicksort work?"' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // 2. Interview state
  const [interviewMsg, setInterviewMsg] = useState('');
  const [interviewLogs, setInterviewLogs] = useState<{ role: string; message: string }[]>([
    { role: 'assistant', message: 'Welcome to your FAANG mock technical screen. Type "Start" when you are ready to receive your problem!' }
  ]);
  const [interviewLoading, setInterviewLoading] = useState(false);

  // 3. Custom Roadmap state
  const [exp, setExp] = useState('Beginner');
  const [commitment, setCommitment] = useState('5 hours/week');
  const [goals, setGoals] = useState('Get a job in 3 months');
  const [roadmapOutput, setRoadmapOutput] = useState('');
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  // Sync tab with URL search parameter if present
  useEffect(() => {
    const t = searchParams.get('tool');
    if (t) setActiveTab(t);
  }, [searchParams]);

  // Tutor submit
  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim() || chatLoading) return;

    const userMessage = chatMsg;
    setChatMsg('');
    setChatLogs(prev => [...prev, { role: 'user', message: userMessage }]);
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage });
      setChatLogs(prev => [...prev, { role: 'assistant', message: res.reply }]);
    } catch (err: any) {
      setChatLogs(prev => [...prev, { role: 'assistant', message: `Error: ${err.message || 'Server connection failed.'}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Interview submit
  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewMsg.trim() || interviewLoading) return;

    const userMessage = interviewMsg;
    setInterviewMsg('');
    setInterviewLogs(prev => [...prev, { role: 'user', message: userMessage }]);
    setInterviewLoading(true);

    try {
      const res = await api.post('/ai/interview', { chatHistory: interviewLogs, currentMessage: userMessage });
      setInterviewLogs(prev => [...prev, { role: 'assistant', message: res.reply }]);
    } catch (err: any) {
      setInterviewLogs(prev => [...prev, { role: 'assistant', message: `Error: ${err.message || 'Interviewer disconnected.'}` }]);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Custom roadmap generator
  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoadmapLoading(true);
    setRoadmapOutput('');
    try {
      const res = await api.post('/ai/roadmap', { experience: exp, timeCommitment: commitment, goals });
      setRoadmapOutput(res.roadmap);
    } catch (err: any) {
      setRoadmapOutput(`Error generating roadmap: ${err.message}`);
    } finally {
      setRoadmapLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Hub Learning Assistants</h1>
        <p className="text-slate-400 text-sm mt-1">Accelerate your progress using customized roadmap tools, code review mechanisms, and simulated interview setups.</p>
      </div>

      {/* Main Tab bar */}
      <div className="flex bg-slate-900/40 rounded-xl p-1.5 border border-white/10 text-xs font-mono font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex-1 py-3 text-center rounded-lg transition-all ${
            activeTab === 'tutor' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          💬 AI DSA Tutor
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`flex-1 py-3 text-center rounded-lg transition-all ${
            activeTab === 'interview' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          🎙️ FAANG Interview Sim
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 py-3 text-center rounded-lg transition-all ${
            activeTab === 'roadmap' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          🗺️ Custom Roadmap Creator
        </button>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[500px]">
        {activeTab === 'tutor' && (
          <div className="border border-white/10 rounded-2xl bg-slate-900/10 flex flex-col h-[550px] overflow-hidden shadow-2xl">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-slate-950/20">
              {chatLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xl rounded-2xl px-4 py-3 text-xs leading-relaxed font-mono ${
                    log.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-white/10 text-slate-300 rounded-tl-none whitespace-pre-line'
                  }`}>
                    <span className="font-bold text-[9px] opacity-50 uppercase block mb-1">
                      {log.role === 'user' ? 'You' : 'AI DSA Tutor'}
                    </span>
                    {log.message}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xl rounded-2xl px-4 py-3 bg-slate-900 border border-white/10 text-slate-400 font-mono text-xs rounded-tl-none flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border border-blue-500 border-t-transparent"></div>
                    Tutor is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input field */}
            <form onSubmit={handleTutorSubmit} className="flex border-t border-white/10 bg-slate-950 p-4 shrink-0">
              <input
                type="text"
                placeholder="Ask your tutor anything (e.g. 'Can you explain Kadane\'s algorithm?')..."
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none text-white font-mono placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="rounded-lg bg-blue-600 hover:bg-blue-500 p-2.5 text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="border border-white/10 rounded-2xl bg-slate-900/10 flex flex-col h-[550px] overflow-hidden shadow-2xl">
            {/* Interview Logs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-slate-950/20">
              {interviewLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xl rounded-2xl px-4 py-3 text-xs leading-relaxed font-mono ${
                    log.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-white/10 text-slate-300 rounded-tl-none whitespace-pre-line'
                  }`}>
                    <span className="font-bold text-[9px] opacity-50 uppercase block mb-1">
                      {log.role === 'user' ? 'Candidate' : 'Interviewer'}
                    </span>
                    {log.message}
                  </div>
                </div>
              ))}
              {interviewLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xl rounded-2xl px-4 py-3 bg-slate-900 border border-white/10 text-slate-400 font-mono text-xs rounded-tl-none flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border border-blue-500 border-t-transparent"></div>
                    Interviewer is taking notes...
                  </div>
                </div>
              )}
            </div>

            {/* Input field */}
            <form onSubmit={handleInterviewSubmit} className="flex border-t border-white/10 bg-slate-950 p-4 shrink-0">
              <input
                type="text"
                placeholder="Type response, write pseudo-code, or ask questions..."
                value={interviewMsg}
                onChange={(e) => setInterviewMsg(e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none text-white font-mono placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={interviewLoading}
                className="rounded-lg bg-blue-600 hover:bg-blue-500 p-2.5 text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Input parameters */}
            <form onSubmit={handleGenerateRoadmap} className="rounded-2xl border border-white/10 bg-slate-900/20 p-6 space-y-5 shadow-lg">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Roadmap Parameters</h3>
              
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Experience Level</label>
                <select
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="Beginner">Beginner (No CS background)</option>
                  <option value="Intermediate">Intermediate (Some college/OOP)</option>
                  <option value="Advanced">Advanced (Solving Leetcode Hard)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Weekly Commitment</label>
                <select
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="3 hours/week">Light (3 hrs/week)</option>
                  <option value="5 hours/week">Regular (5-8 hrs/week)</option>
                  <option value="15 hours/week">Intense (15+ hrs/week)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Key Goals</label>
                <input
                  type="text"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none"
                  placeholder="e.g. Get a software engineering job in 3 months"
                />
              </div>

              <button
                type="submit"
                disabled={roadmapLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors font-mono"
              >
                {roadmapLoading ? 'Generating Roadmap...' : 'Generate custom roadmap'}
              </button>
            </form>

            {/* Generated output */}
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-900/10 p-6 min-h-[400px]">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Custom Learning Path</h3>
              
              {roadmapLoading ? (
                <div className="flex h-64 items-center justify-center gap-2 text-slate-400 font-mono text-sm">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  AI compiling roadmap...
                </div>
              ) : roadmapOutput ? (
                <div className="mt-4 prose prose-invert max-w-none text-slate-300 text-xs font-mono whitespace-pre-line leading-relaxed">
                  {roadmapOutput}
                </div>
              ) : (
                <div className="mt-20 text-center text-slate-500 font-mono text-xs">
                  Fill in your experience and goal parameters on the left to generate a personalized timeline mapping.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
