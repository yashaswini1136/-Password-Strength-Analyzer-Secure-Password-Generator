import React from 'react';
import { Check, X } from 'lucide-react';
import type { PasswordAnalysisResult } from '../types/password';
import { getScoreTheme } from '../utils/securityUtils';

interface StrengthMeterProps {
  analysis: PasswordAnalysisResult;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ analysis }) => {
  const { score, strengthLevel, length, hasUppercase, hasLowercase, hasNumbers, hasSpecialCharacters } = analysis;
  const theme = getScoreTheme(score);

  // Five bar segments calculation
  const segments = [
    { label: 'Very Weak', minScore: 1 },
    { label: 'Weak', minScore: 21 },
    { label: 'Medium', minScore: 41 },
    { label: 'Strong', minScore: 61 },
    { label: 'Very Strong', minScore: 81 },
  ];

  const requirements = [
    { label: 'Minimum 8+ characters', met: length >= 8, recommended: '12–16+ recommended' },
    { label: 'Uppercase letter (A–Z)', met: hasUppercase, count: analysis.uppercaseCount },
    { label: 'Lowercase letter (a–z)', met: hasLowercase, count: analysis.lowercaseCount },
    { label: 'Numeric digit (0–9)', met: hasNumbers, count: analysis.numberCount },
    { label: 'Special symbol (!@#$%)', met: hasSpecialCharacters, count: analysis.specialCount },
  ];

  return (
    <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
      {/* Strength Header & Category */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Password Strength
          </span>
          {length === 0 && (
            <span className="text-[11px] text-slate-500 font-mono">
              (Awaiting input)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Rating:</span>
          <span
            className={`text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${theme.badgeBg}`}
          >
            {length === 0 ? 'NO INPUT' : strengthLevel}
          </span>
        </div>
      </div>

      {/* Segmented Strength Meter Bar */}
      <div className="grid grid-cols-5 gap-1.5 h-3 mb-4">
        {segments.map((seg) => {
          const isActive = length > 0 && score >= seg.minScore;
          return (
            <div
              key={seg.label}
              className={`h-full rounded-full transition-all duration-300 ${
                isActive
                  ? theme.barColor
                  : 'bg-slate-800/80'
              }`}
              title={`${seg.label} threshold`}
            />
          );
        })}
      </div>

      {/* Numerical score indicator bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-6 font-mono">
        <span>0 (Critical)</span>
        <span className="text-slate-500">20</span>
        <span className="text-slate-500">40</span>
        <span className="text-slate-500">60</span>
        <span className="text-slate-500">80</span>
        <span>100 (Fortified)</span>
      </div>

      {/* Character Composition Requirements Checklist */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Character Composition & Policies
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {requirements.map((req) => (
            <div
              key={req.label}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-colors ${
                req.met
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    req.met
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {req.met ? <Check className="w-3 h-3 stroke-[2.5]" /> : <X className="w-3 h-3" />}
                </div>
                <span className={req.met ? 'font-medium text-slate-200' : 'text-slate-400'}>
                  {req.label}
                </span>
              </div>

              {req.count !== undefined && req.met && (
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {req.count}
                </span>
              )}
            </div>
          ))}

          {/* Entropy summary pill */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
            <span className="text-slate-400">Entropy Pool:</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {analysis.charSetSize} possible chars
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
