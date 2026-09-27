import React from 'react';
import { ShieldCheck, Cpu, BookOpen, Info, Lock } from 'lucide-react';

export type NavTab = 'analyzer' | 'generator' | 'guide' | 'about';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row items-center justify-between py-4 gap-4">
          {/* Logo & Official Title */}
          <div className="flex items-center gap-3 text-left w-full xl:w-auto">
            <div className="relative p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cyber-glow-emerald shrink-0">
              <Lock className="w-6 h-6 stroke-[2.2]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-white font-display">
                  PASSWORD STRENGTH ANALYZER
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SOC v2.5
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-emerald-400 tracking-wide font-display">
                &amp; SECURE PASSWORD GENERATOR
              </span>
              <p className="text-[11px] font-mono text-slate-400 tracking-wide mt-0.5">
                “Analyze. Generate. Protect.”
              </p>
            </div>
          </div>

          {/* Navigation & Zero-Telemetry badge */}
          <div className="flex flex-wrap items-center justify-between xl:justify-end gap-3 w-full xl:w-auto">
            <nav className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'analyzer'}
                onClick={() => onTabChange('analyzer')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'analyzer'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Analyzer</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'generator'}
                onClick={() => onTabChange('generator')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'generator'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Generator</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'guide'}
                onClick={() => onTabChange('guide')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'guide'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Security Guide</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'about'}
                onClick={() => onTabChange('about')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'about'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
            </nav>

            {/* Client-Side Guarantee Tag */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Client-Side Engine</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
