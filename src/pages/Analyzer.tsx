import React, { useState } from 'react';
import { PasswordInput } from '../components/PasswordInput';
import { StrengthMeter } from '../components/StrengthMeter';
import { SecurityScore } from '../components/SecurityScore';
import { PatternDetection } from '../components/PatternDetection';
import { Recommendations } from '../components/Recommendations';
import { CrackTimeEstimate } from '../components/CrackTimeEstimate';
import { DemoEducational } from '../components/DemoEducational';
import { SecurityReport } from '../components/SecurityReport';
import { analyzePassword } from '../services/passwordAnalyzer';
import { Shield, Sparkles } from 'lucide-react';

interface AnalyzerPageProps {
  onNavigateToGenerator: () => void;
  initialPassword?: string;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  onNavigateToGenerator,
  initialPassword = ''
}) => {
  const [password, setPassword] = useState<string>(initialPassword);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Analyze password in real-time
  const analysis = analyzePassword(password);

  const handleClear = () => {
    setPassword('');
  };

  const handleSelectExample = (sample: string) => {
    setPassword(sample);
    // Smooth scroll back to input if user scrolled down
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Real-Time Cryptographic Evaluation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Password Strength Analyzer
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Evaluate authentication credentials against dictionary wordlists, keyboard walks, sequential sequences, and information entropy heuristics. Analysis operates entirely client-side.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Audit Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Password Input Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <PasswordInput
          value={password}
          onChange={setPassword}
          onClear={handleClear}
          isCommonPassword={analysis.isCommonPassword}
        />
      </div>

      {/* Real-time Strength Meter & Checklist */}
      <StrengthMeter analysis={analysis} />

      {/* Security Score Gauge & 6 Metric Cards */}
      <SecurityScore
        analysis={analysis}
        onOpenReport={password.length > 0 ? () => setIsReportOpen(true) : undefined}
      />

      {/* Brute-force Crack Time Scenario Estimates */}
      <CrackTimeEstimate
        crackTimes={analysis.crackTimes}
        isCommon={analysis.isCommonPassword}
        length={analysis.length}
      />

      {/* Grid: Weak Patterns & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatternDetection
          patterns={analysis.detectedPatterns}
          passwordLength={analysis.length}
        />

        <Recommendations
          recommendations={analysis.recommendations}
          passwordLength={analysis.length}
          score={analysis.score}
          onNavigateToGenerator={onNavigateToGenerator}
        />
      </div>

      {/* Educational Demonstration Presets (Section 28) */}
      <DemoEducational onSelectExample={handleSelectExample} />

      {/* Security Audit Report Modal */}
      <SecurityReport
        analysis={analysis}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
