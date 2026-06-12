'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Search, ChevronLeft, ChevronRight, Play, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Problems() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [company, setCompany] = useState('');
  const [tag, setTag] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50'
      });

      if (search) queryParams.append('search', search);
      if (difficulty) queryParams.append('difficulty', difficulty);
      if (company) queryParams.append('company', company);
      if (tag) queryParams.append('tag', tag);

      const res = await api.get(`/questions?${queryParams.toString()}`);
      setQuestions(res.questions);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, difficulty, company, tag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchQuestions();
  };

  const clearFilters = () => {
    setSearch('');
    setDifficulty('');
    setCompany('');
    setTag('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Practice Problems</h1>
        <p className="text-slate-400 text-sm mt-1">Solve challenges curated across 300+ DSA topics. Boost your ratings and unlock achievements.</p>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4 items-center bg-slate-900/30 p-5 rounded-2xl border border-white/5 shadow-md">
        {/* Search */}
        <div className="flex-1 min-w-[240px] flex items-center gap-2 border border-white/10 rounded-lg bg-slate-950 px-3 py-2.5">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none border-none"
          />
        </div>

        {/* Difficulty */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-300 outline-none focus:border-blue-500"
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>

        {/* Company */}
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-300 outline-none focus:border-blue-500"
        >
          <option value="">All Companies</option>
          <option value="Google">Google</option>
          <option value="Microsoft">Microsoft</option>
          <option value="Amazon">Amazon</option>
          <option value="Meta">Meta</option>
          <option value="Netflix">Netflix</option>
          <option value="Apple">Apple</option>
        </select>

        {/* Tag */}
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-300 outline-none focus:border-blue-500"
        >
          <option value="">All Topics</option>
          <option value="Arrays">Arrays</option>
          <option value="Strings">Strings</option>
          <option value="Linked List">Linked Lists</option>
          <option value="Stack">Stack & Queue</option>
          <option value="Graph">Graphs</option>
          <option value="Dynamic Programming">DP</option>
          <option value="Greedy">Greedy</option>
        </select>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-all font-mono"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 border border-white/10 transition-all font-mono"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Problems Count */}
      <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
        <span>Found {totalCount} matching problems</span>
        <span>Page {currentPage} of {totalPages || 1}</span>
      </div>

      {/* Problems Table */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-slate-900/10">
          <p className="text-slate-400 font-mono text-sm">No problems match your filter selection.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/10 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/40 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                <th className="px-6 py-4 w-16 text-center">Status</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Topic Area</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Acceptance</th>
                <th className="px-6 py-4">Est. Time</th>
                <th className="px-6 py-4">Target Companies</th>
                <th className="px-6 py-4 w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {questions.map((q) => {
                const diffColor =
                  q.difficulty === 'EASY'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : q.difficulty === 'MEDIUM'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-red-400 bg-red-500/10 border-red-500/20';

                return (
                  <tr key={q.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-center">
                      {q.status === 'COMPLETED' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto fill-emerald-500/10" />
                      ) : q.status === 'ATTEMPTED' ? (
                        <div className="h-4 w-4 rounded-full border border-amber-400 mx-auto border-dashed animate-spin"></div>
                      ) : (
                        <span className="text-slate-700 font-mono text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <Link href={`/problems/${q.slug}`} className="hover:text-blue-400 transition-colors">
                        {q.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-xs font-mono">{q.concept.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${diffColor}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">{q.acceptanceRate}%</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">{q.estimatedTime}m</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {q.companyTags.slice(0, 2).map((comp: string, idx: number) => (
                          <span key={idx} className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400 border border-white/5 font-mono">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/problems/${q.slug}`}
                        className="flex items-center gap-1.5 rounded bg-blue-600 hover:bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white transition-all w-fit font-mono"
                      >
                        <Play className="h-3 w-3 fill-white" />
                        <span>Code</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition-all font-mono"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-xs text-slate-400 font-mono">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition-all font-mono"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
