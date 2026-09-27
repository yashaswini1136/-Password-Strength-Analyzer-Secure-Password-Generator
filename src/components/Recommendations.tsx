import React from 'react';
import { Lightbulb, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string[];
  passwordLength: number;
  score: number;
  onNavigateToGenerator?: () => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  passwordLength,
  score,
  onNavigateToGenerator
}) => {
  if (passwordLength === 0) {
    return (
      <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            Security Recommendations
          </h4>
        </div>
        <p className="text-xs text-slate-400">
          Enter a password above to generate real-time defensive hardening recommendations.
        </p>
      </div>
    );
  }

  const isStrong = score >= 80;

  return (
    <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            Security Recommendations
          </h4>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {recommendations.length} Actionable Items
        </span>
      </div>

      <div className="space-y-2.5 mb-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl border flex items-start gap-3 text-xs leading-relaxed transition-all ${
              isStrong
                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
                : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
            }`}
          >
            {isStrong ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{rec}</span>
          </div>
        ))}
      </div>

      {score < 70 && onNavigateToGenerator && (
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Need an uncrackable credential immediately?
          </span>
          <button
            type="button"
            onClick={onNavigateToGenerator}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Secure Generator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
