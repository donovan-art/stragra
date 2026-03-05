import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProblemSolutionPair {
  id: number;
  problem: string;
  solution: string;
}

const pairs: ProblemSolutionPair[] = [
  { id: 1, problem: "Late payments destroying cash flow", solution: "Automated payment reminders & tracking" },
  { id: 2, problem: "Missed lien deadlines = lost money", solution: "Smart deadline calendar with alerts" },
  { id: 3, problem: "GCs ignore your calls", solution: "AI voice agent answers 24/7" },
  { id: 4, problem: "Manual paperwork drowning you", solution: "One-click document generation" },
  { id: 5, problem: "No visibility into job profitability", solution: "Real-time financial dashboard" },
];

export default function DualColumnScroller() {
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pairs.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="relative w-full h-[400px] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex justify-between items-center h-full px-8">
        {/* Left Column - Problems (Red) */}
        <div className="w-[45%] h-full relative overflow-hidden">
          <div 
            className="absolute w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(-${activeIndex * 160}px)` }}
          >
            {pairs.map((pair, idx) => (
              <div 
                key={`problem-${pair.id}`}
                className={`relative h-[160px] flex items-center p-6 mb-4 rounded-lg border border-red-800 bg-gray-900/50 transition-all duration-300 ${
                  idx === activeIndex ? 'opacity-100 scale-100 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'opacity-30 scale-95'
                }`}
              >
                <div className="absolute right-[-6px] w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                <AlertCircle className="w-6 h-6 text-red-400 mr-4 flex-shrink-0" />
                <span className="text-gray-100 font-medium">{pair.problem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Beam */}
        <div className="w-[10%] flex items-center justify-center relative">
          <div className="w-full h-0.5 bg-gradient-to-r from-red-500 to-teal-500 rounded-full animate-pulse" />
        </div>

        {/* Right Column - Solutions (Teal) */}
        <div className="w-[45%] h-full relative overflow-hidden">
          <div 
            className="absolute w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(${(pairs.length - 1 - activeIndex) * 160}px)` }}
          >
            {[...pairs].reverse().map((pair, idx) => (
              <div 
                key={`solution-${pair.id}`}
                className={`relative h-[160px] flex items-center p-6 mb-4 rounded-lg border border-teal-800 bg-gray-900/50 transition-all duration-300 ${
                  (pairs.length - 1 - idx) === activeIndex ? 'opacity-100 scale-100 shadow-[0_0_20px_rgba(20,184,166,0.3)]' : 'opacity-30 scale-95'
                }`}
              >
                <div className="absolute left-[-6px] w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                <CheckCircle2 className="w-6 h-6 text-teal-400 mr-4 flex-shrink-0" />
                <span className="text-gray-100 font-medium">{pair.solution}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
