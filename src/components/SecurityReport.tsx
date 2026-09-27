import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText, 
  Lock 
} from 'lucide-react';
import type { PasswordAnalysisResult, SecurityReportData } from '../types/password';
import { generatePlainTextReport, copySecurely } from '../utils/securityUtils';

interface SecurityReportProps {
  analysis: PasswordAnalysisResult;
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityReport: React.FC<SecurityReportProps> = ({ analysis, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const now = new Date();
  const timestamp = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' at ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const reportData: SecurityReportData = {
    generatedAt: timestamp,
    score: analysis.score,
    strengthLevel: analysis.strengthLevel,
    length: analysis.length,
    hasUppercase: analysis.hasUppercase,
    hasLowercase: analysis.hasLowercase,
    hasNumbers: analysis.hasNumbers,
    hasSpecialCharacters: analysis.hasSpecialCharacters,
    uniqueChars: analysis.uniqueCharCount,
    detectedPatterns: analysis.detectedPatterns.map(p => ({
      name: p.name,
      description: p.description,
      severity: p.severity
    })),
    isCommonPassword: analysis.isCommonPassword,
    commonPasswordNote: analysis.commonPasswordMatch 
      ? `Found match with "${analysis.commonPasswordMatch}" in common leaked lists.`
      : undefined,
    recommendations: analysis.recommendations,
    entropyBits: analysis.entropyBits,
    crackTimeOfflineGPU: analysis.crackTimes.offlineFastHash
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = generatePlainTextReport(reportData);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Password-Strength-Analyzer-Audit-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = async () => {
    const text = generatePlainTextReport(reportData);
    const ok = await copySecurely(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden print-card text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 no-print">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 id="report-modal-title" className="text-base font-bold text-white font-display">
              Security Analysis Report
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Print Report"
              aria-label="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Download Report as Text"
              aria-label="Download Report as Text"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Copy Report"
              aria-label="Copy Report"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors ml-2"
              title="Close Modal"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Visible Report Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
            <div>
              <div className="text-base sm:text-lg font-black tracking-wide text-emerald-400 font-display">
                PASSWORD STRENGTH ANALYZER &amp; SECURE PASSWORD GENERATOR
              </div>
              <div className="text-xs text-slate-400">
                Cybersecurity Evaluation &amp; Heuristic Audit Report
              </div>
            </div>
            <div className="text-left sm:text-right text-xs font-mono text-slate-400">
              <div>Date: {timestamp}</div>
              <div className="text-emerald-400 font-semibold">Engine: Local WebCrypto Heuristic v2.5</div>
            </div>
          </div>

          {/* PRIVACY WARNING / NOTICE */}
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero-Knowledge Disclosure:</strong> In accordance with strict cryptographic standards, the actual password string is <em>never stored or included in this report</em>.
            </span>
          </div>

          {/* Section 1: Score & Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs uppercase text-slate-400 mb-1">Security Score</div>
              <div className="text-3xl font-black font-mono text-emerald-400">
                {analysis.score} <span className="text-sm text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs uppercase text-slate-400 mb-1">Strength Level</div>
              <div className="text-xl font-bold font-display text-white mt-1">
                {analysis.strengthLevel}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs uppercase text-slate-400 mb-1">Information Entropy</div>
              <div className="text-2xl font-bold font-mono text-blue-400 mt-0.5">
                {analysis.entropyBits} <span className="text-xs text-slate-400">bits</span>
              </div>
            </div>
          </div>

          {/* Section 2: Structural Audit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              1. Structural Composition Metrics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">Length:</span>
                <span className="font-mono text-sm font-semibold text-white">{analysis.length} characters</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">Uppercase:</span>
                <span className={`font-semibold ${analysis.hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {analysis.hasUppercase ? `Detected (${analysis.uppercaseCount})` : 'Missing'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">Lowercase:</span>
                <span className={`font-semibold ${analysis.hasLowercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {analysis.hasLowercase ? `Detected (${analysis.lowercaseCount})` : 'Missing'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">Numbers &amp; Symbols:</span>
                <span className={`font-semibold ${analysis.hasNumbers && analysis.hasSpecialCharacters ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {analysis.numberCount} num, {analysis.specialCount} sym
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Threat & Pattern Analysis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              2. Threat Surface &amp; Detected Vulnerabilities
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Common Leaked Password Dictionary Check:</span>
                <span className={`font-semibold ${analysis.isCommonPassword ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {analysis.isCommonPassword ? 'COMPROMISED (Found in top breach lists)' : 'PASSED (Zero common matches)'}
                </span>
              </div>

              {analysis.detectedPatterns.length === 0 ? (
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-emerald-400 font-medium">
                  ✓ No predictable sequences, keyboard walks, or structural repetitions found.
                </div>
              ) : (
                analysis.detectedPatterns.map(p => (
                  <div key={p.id} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{p.description}</div>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                      {p.severity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 4: Security Recommendations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              3. Hardening Recommendations
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60 gap-3 no-print">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit conducted locally with browser Web Crypto API.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/25"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
