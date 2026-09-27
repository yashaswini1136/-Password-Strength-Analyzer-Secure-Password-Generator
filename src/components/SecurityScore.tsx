import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Binary, 
  Layers, 
  FileWarning, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import type { PasswordAnalysisResult } from '../types/password';
import { getScoreTheme } from '../utils/securityUtils';

interface SecurityScoreProps {
  analysis: PasswordAnalysisResult;
  onOpenReport?: () => void;
}

export const SecurityScore: React.FC<SecurityScoreProps> = ({ analysis, onOpenReport }) => {
  const { score, strengthLevel, length, uniqueCharCount, detectedPatterns, isCommonPassword, entropyBits } = analysis;
  const theme = getScoreTheme(score);

  // Length category classification
  let lengthCategory = 'Critically Short (<8)';
  let lengthColor = 'text-rose-400';
  if (length >= 16) {
    lengthCategory = 'Fortified (16+ chars)';
    lengthColor = 'text-emerald-400';
  } else if (length >= 12) {
    lengthCategory = 'Strong (12–15 chars)';
    lengthColor = 'text-blue-400';
  } else if (length >= 8) {
    lengthCategory = 'Moderate (8–11 chars)';
    lengthColor = 'text-amber-400';
  }

  // Diversity classification
  const categoriesCount = [
    analysis.hasUppercase,
    analysis.hasLowercase,
    analysis.hasNumbers,
    analysis.hasSpecialCharacters,
  ].filter(Boolean).length;

  const diversityCategory = `${categoriesCount}/4 Types Active`;
  const diversityColor = categoriesCount === 4 ? 'text-emerald-400' : categoriesCount >= 3 ? 'text-blue-400' : 'text-amber-400';

  // Pattern risk classification
  let patternRiskLevel = 'None Detected';
  let patternRiskColor = 'text-emerald-400';
  if (detectedPatterns.some(p => p.severity === 'critical')) {
    patternRiskLevel = 'Critical Risk';
    patternRiskColor = 'text-rose-400';
  } else if (detectedPatterns.some(p => p.severity === 'high')) {
    patternRiskLevel = 'High Risk';
    patternRiskColor = 'text-orange-400';
  } else if (detectedPatterns.length > 0) {
    patternRiskLevel = `${detectedPatterns.length} Pattern(s)`;
    patternRiskColor = 'text-amber-400';
  }

  return (
    <div className="w-full">
      {/* Primary Score Banner Card */}
      <div className={`p-6 rounded-2xl border bg-slate-900/80 transition-all ${theme.borderColor} ${theme.glowClass} mb-6`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Circular / Large Score Display */}
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
              <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * score) / 100}
                  strokeLinecap="round"
                  className={`${theme.color} transition-all duration-700`}
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-2xl font-black font-mono tracking-tight ${theme.color}`}>
                  {length === 0 ? '--' : score}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">/100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  Overall Security Score
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${theme.badgeBg}`}>
                  {length === 0 ? 'NO PASSWORD' : strengthLevel}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                {length === 0
                  ? 'Awaiting Password Analysis'
                  : score >= 81
                  ? 'Enterprise Fortified Password'
                  : score >= 61
                  ? 'Strong Authentication Standard'
                  : score >= 41
                  ? 'Moderate / Vulnerable to Attacks'
                  : 'Critical Weakness Detected'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                {length === 0
                  ? 'Input a string to run heuristic multi-vector analysis across length, entropy, and dictionary lookups.'
                  : score >= 80
                  ? 'Exceeds standard enterprise credential security guidelines. Resistant to offline hashcat dictionaries.'
                  : score >= 60
                  ? 'Good complexity, but can be further hardened against mask and dictionary-hybrid attacks.'
                  : 'Vulnerable to brute-force, pattern dictionaries, or credential stuffing. Hardening strongly recommended.'}
              </p>
            </div>
          </div>

          {/* Generate Security Report CTA */}
          {onOpenReport && (
            <div className="w-full md:w-auto shrink-0 flex md:flex-col justify-end">
              <button
                type="button"
                onClick={onOpenReport}
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:border-emerald-500/50 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Audit & Report</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of 6 Analysis Factor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Password Length */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Password Length</span>
            <Key className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {length}
            </span>
            <span className="text-xs text-slate-400">chars</span>
          </div>
          <div className={`text-xs mt-1 font-medium ${lengthColor}`}>
            {lengthCategory}
          </div>
        </div>

        {/* Card 2: Character Diversity */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Character Diversity</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {categoriesCount}
            </span>
            <span className="text-xs text-slate-400">of 4 categories</span>
          </div>
          <div className={`text-xs mt-1 font-medium ${diversityColor}`}>
            {diversityCategory} ({uniqueCharCount} unique)
          </div>
        </div>

        {/* Card 3: Pattern Risk */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Pattern Risk</span>
            <FileWarning className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {detectedPatterns.length}
            </span>
            <span className="text-xs text-slate-400">flaws detected</span>
          </div>
          <div className={`text-xs mt-1 font-medium ${patternRiskColor}`}>
            {patternRiskLevel}
          </div>
        </div>

        {/* Card 4: Common Password Database */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Common Password Database</span>
            {isCommonPassword ? (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-base font-bold font-display ${
                isCommonPassword ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isCommonPassword ? 'Compromised / Listed' : 'Not in Common List'}
            </span>
          </div>
          <div className="text-xs mt-1 text-slate-400">
            {isCommonPassword
              ? (analysis.commonPasswordMatch ? `Matched: "${analysis.commonPasswordMatch}"` : 'Appears in top leaked lists')
              : 'Zero matches in local threat dictionary'}
          </div>
        </div>

        {/* Card 5: Estimated Entropy */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Estimated Entropy</span>
            <Binary className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {entropyBits}
            </span>
            <span className="text-xs text-slate-400">bits</span>
          </div>
          <div className="text-xs mt-1 text-slate-400">
            {entropyBits >= 80 ? 'Fortified against offline clusters' : entropyBits >= 50 ? 'Reasonable online resilience' : 'Low cryptographic entropy'}
          </div>
        </div>

        {/* Card 6: Security Level */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Security Level</span>
            <Zap className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold font-display ${theme.color}`}>
              {length === 0 ? 'Undetermined' : strengthLevel}
            </span>
          </div>
          <div className="text-xs mt-1 text-slate-400">
            Tier {score >= 81 ? '1 (Elite)' : score >= 61 ? '2 (Standard)' : score >= 41 ? '3 (Borderline)' : '4 (High Risk)'}
          </div>
        </div>
      </div>
    </div>
  );
};
