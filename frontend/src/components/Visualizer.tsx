'use client';

import React, { useState } from 'react';
import { ArrowRight, Plus, Minus, Search, Play } from 'lucide-react';

interface VisualizerProps {
  type: string; // 'arrays', 'linked-lists', 'stack-queue', 'trees', 'graphs'
}

export default function Visualizer({ type }: VisualizerProps) {
  // 1. Array Visualizer State
  const [arrayData, setArrayData] = useState<number[]>([12, 35, 7, 19, 42]);
  const [searchVal, setSearchVal] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Interact to visualize operations');

  // 2. Stack/Queue State
  const [stackData, setStackData] = useState<number[]>([10, 20, 30]);

  // Array Actions
  const handleInsert = () => {
    if (arrayData.length >= 8) {
      setStatusMessage('Array size limit reached (max 8 for visualizer)');
      return;
    }
    const newVal = Math.floor(Math.random() * 90) + 10;
    setArrayData([...arrayData, newVal]);
    setStatusMessage(`Inserted ${newVal} at index ${arrayData.length}`);
  };

  const handleDelete = () => {
    if (arrayData.length <= 1) {
      setStatusMessage('Cannot empty array entirely');
      return;
    }
    const popped = arrayData[arrayData.length - 1];
    setArrayData(arrayData.slice(0, -1));
    setStatusMessage(`Deleted last element ${popped}`);
  };

  const handleSearch = async () => {
    const target = parseInt(searchVal);
    if (isNaN(target)) {
      setStatusMessage('Enter a valid number to search');
      return;
    }

    setStatusMessage(`Searching for ${target}...`);
    for (let i = 0; i < arrayData.length; i++) {
      setActiveIndex(i);
      setStatusMessage(`Checking index ${i} (value: ${arrayData[i]})...`);
      // Brief sleep simulation using promise
      await new Promise((res) => setTimeout(res, 600));
      if (arrayData[i] === target) {
        setStatusMessage(`Target ${target} FOUND at index ${i}!`);
        return;
      }
    }
    setActiveIndex(null);
    setStatusMessage(`Target ${target} not found in array.`);
  };

  // Stack Actions
  const handlePush = () => {
    if (stackData.length >= 6) return;
    setStackData([...stackData, Math.floor(Math.random() * 90) + 10]);
  };

  const handlePop = () => {
    if (stackData.length === 0) return;
    setStackData(stackData.slice(0, -1));
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-sm text-white">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <h3 className="text-lg font-bold tracking-tight text-blue-400 font-mono">⚡ Interactive DSA Sandbox</h3>
        <span className="rounded bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 capitalize">{type} Playground</span>
      </div>

      {/* Render Array visualizer */}
      {(type === 'arrays' || type === 'sorting' || type === 'searching') && (
        <div>
          {/* Array Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-6 min-h-[100px]">
            {arrayData.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg border transition-all duration-300 transform ${
                    activeIndex === idx
                      ? 'bg-blue-600 border-blue-400 scale-110 shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 border-white/10 hover:border-blue-500/40'
                  }`}
                >
                  {val}
                </div>
                <span className="text-xs text-slate-500 mt-2 font-mono">[{idx}]</span>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-wrap gap-3 items-center justify-center">
            <button
              onClick={handleInsert}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-semibold transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Insert Item
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold border border-white/10 transition-all"
            >
              <Minus className="h-3.5 w-3.5" /> Delete End
            </button>

            <div className="flex items-center gap-2 border border-white/10 rounded-lg bg-slate-950 px-2 py-1">
              <input
                type="number"
                placeholder="Val"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-12 bg-transparent text-sm text-center outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={handleSearch}
                className="rounded p-1 bg-blue-600 hover:bg-blue-500 transition-colors"
                title="Search Array"
              >
                <Search className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Linked List visualizer */}
      {type === 'linked-lists' && (
        <div>
          {/* Linked List Nodes */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-6 min-h-[100px]">
            {arrayData.map((val, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-md">
                  <div className="px-4 py-3 font-bold text-lg border-r border-white/5">{val}</div>
                  <div className="px-2 py-1 text-[10px] text-slate-500 font-mono">next</div>
                </div>
                {idx < arrayData.length - 1 ? (
                  <ArrowRight className="h-5 w-5 text-blue-400 animate-pulse" />
                ) : (
                  <span className="text-xs font-semibold text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded border border-red-500/20">NULL</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={handleInsert}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-semibold transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Append Node
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold border border-white/10 transition-all"
            >
              <Minus className="h-3.5 w-3.5" /> Delete Tail
            </button>
          </div>
        </div>
      )}

      {/* Render Stack/Queue visualizer */}
      {(type === 'stack-queue' || type === 'stack' || type === 'queue') && (
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center py-4">
          {/* Stack Display */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Stack (LIFO)</h4>
            <div className="w-24 h-48 border-x border-b border-blue-500/40 rounded-b-xl bg-slate-950/30 flex flex-col-reverse p-2 gap-1.5 justify-start overflow-hidden">
              {stackData.map((val, idx) => (
                <div
                  key={idx}
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg flex items-center justify-center font-bold text-sm text-blue-400 transition-all transform hover:scale-105 duration-200"
                >
                  {val}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handlePush} className="p-1.5 bg-blue-600 hover:bg-blue-500 text-xs rounded font-bold">Push</button>
              <button onClick={handlePop} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-white/10 font-bold">Pop</button>
            </div>
          </div>

          {/* Queue Display */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Queue (FIFO)</h4>
            <div className="h-24 w-60 border-y border-purple-500/40 bg-slate-950/30 flex items-center p-2 gap-1.5 justify-start overflow-hidden rounded-lg">
              {stackData.map((val, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg flex items-center justify-center font-bold text-sm text-purple-400 transition-all transform hover:scale-105 duration-200"
                >
                  {val}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handlePush} className="p-1.5 bg-purple-600 hover:bg-purple-500 text-xs rounded font-bold">Enqueue</button>
              <button onClick={() => setStackData(stackData.slice(1))} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-white/10 font-bold">Dequeue</button>
            </div>
          </div>
        </div>
      )}

      {/* Render Trees/Graphs Placeholder with aesthetic mockup */}
      {(type === 'trees' || type === 'graphs') && (
        <div className="flex flex-col items-center justify-center py-6">
          <svg className="w-56 h-40" viewBox="0 0 200 120">
            {/* Root */}
            <circle cx="100" cy="20" r="12" className="fill-slate-800 stroke-blue-400 stroke-2" />
            <text x="100" y="24" className="fill-white text-[10px] text-center font-bold font-mono" textAnchor="middle">R</text>

            {/* Edges */}
            <line x1="92" y1="28" x2="68" y2="52" className="stroke-slate-700 stroke-2" />
            <line x1="108" y1="28" x2="132" y2="52" className="stroke-slate-700 stroke-2" />

            {/* Left Child */}
            <circle cx="60" cy="60" r="12" className="fill-slate-800 stroke-blue-400 stroke-2" />
            <text x="60" y="64" className="fill-white text-[10px] text-center font-bold font-mono" textAnchor="middle">L</text>

            {/* Right Child */}
            <circle cx="140" cy="60" r="12" className="fill-slate-800 stroke-purple-400 stroke-2" />
            <text x="140" y="64" className="fill-white text-[10px] text-center font-bold font-mono" textAnchor="middle">R</text>

            <line x1="52" y1="68" x2="38" y2="92" className="stroke-slate-700 stroke-2" />
            <line x1="68" y1="68" x2="82" y2="92" className="stroke-slate-700 stroke-2" />

            {/* Grandchildren */}
            <circle cx="30" cy="100" r="10" className="fill-slate-800 stroke-blue-500/40" />
            <text x="30" y="103" className="fill-slate-400 text-[8px]" textAnchor="middle">LL</text>

            <circle cx="90" cy="100" r="10" className="fill-slate-800 stroke-blue-500/40" />
            <text x="90" y="103" className="fill-slate-400 text-[8px]" textAnchor="middle">LR</text>
          </svg>

          <p className="text-xs text-slate-400 text-center max-w-sm mt-4 leading-relaxed">
            Depth First Search (DFS) order: **Root → Left → Left-Left → Left-Right → Right**.
            Breadth First Search (BFS) level traversal: **[Root] → [Left, Right] → [LL, LR]**.
          </p>
        </div>
      )}

      {/* Info Status Box */}
      <div className="mt-6 rounded-lg bg-slate-950/50 border border-white/5 px-4 py-2.5 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
        <Play className="h-3 w-3 text-blue-400 fill-blue-400 animate-pulse" />
        <span>{statusMessage}</span>
      </div>
    </div>
  );
}
