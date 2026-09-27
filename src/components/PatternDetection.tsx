import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Hash, 
  Keyboard, 
  Repeat, 
  Calendar, 
  AtSign 
} from 'lucide-react';
import type { DetectedPattern, PatternSeverity } from '../types/password';

interface PatternDetectionProps {
  patterns: DetectedPattern[];
  passwordLength: number;
}

export const PatternDetection: React.FC<PatternDetectionProps> = ({ patterns, passwordLength }) => {
  if (passwordLength === 0) {
    return (
      <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-200">
            Detected Weak Patterns
          </h4>
          <span className="text-xs text-slate-500 font-mono">Heuristic Scanner</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 text-center">
          Enter a password to initiate pattern, sequence, and keyboard walk scanning.
        </div>
      </div>
    );
  }

  const getSeverityBadge = (severity: PatternSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'sequential':
        return <Hash className="w-4 h-4 text-amber-400" />;
      case 'keyboard':
        return <Keyboard className="w-4 h-4 text-orange-400" />;
      case 'repeated':
        return <Repeat className="w-4 h-4 text-rose-400" />;
      case 'date':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'username':
        return <AtSign className="w-4 h-4 text-rose-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            Detected Weak Patterns
          </h4>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {patterns.length === 0 ? 'Clean' : `${patterns.length} Identified`}
        </span>
      </div>

      {patterns.length === 0 ? (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-emerald-300">
              No Significant Weak Patterns Detected
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              The entered password is free of sequential digits, obvious keyboard walks, character repetition, and simple dictionary structures.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {patterns.map((pattern) => (
            <div
              key={pattern.id + pattern.name}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 mt-0.5 shrink-0">
                    {getPatternIcon(pattern.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-slate-200">
                        {pattern.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 font-medium">
                      {pattern.description}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {pattern.detail}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${getSeverityBadge(
                    pattern.severity
                  )}`}
                >
                  {pattern.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
