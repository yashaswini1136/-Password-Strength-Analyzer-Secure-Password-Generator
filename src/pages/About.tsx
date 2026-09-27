import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Binary, 
  Code2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cybersecurity Capstone &amp; Educational Project</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            About Password Strength Analyzer &amp; Secure Password Generator
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-semibold">
            “Password Strength Analyzer &amp; Secure Password Generator is a password security analysis and generation tool designed to demonstrate practical concepts of authentication security, password strength evaluation, pattern detection, and secure password generation.”
          </p>
        </div>
      </div>

      {/* PRIVACY & SECURITY MANDATE (Section 19) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/40 cyber-glow-emerald space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Zero-Knowledge Architecture &amp; Privacy Pledge
            </h3>
            <span className="text-xs text-emerald-400 font-mono">
              Strict Local-Only Client Execution Guarantee
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 text-sm text-emerald-200 leading-relaxed font-medium">
          “Your password is analyzed locally in your browser. Password Strength Analyzer &amp; Secure Password Generator does not send, upload, or store your entered password.”
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
            <div className="text-emerald-400 font-bold mb-1">✓ No Server / Backend</div>
            <p className="text-slate-400 text-[11px]">All scoring and pattern algorithms execute inside your local browser engine.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
            <div className="text-emerald-400 font-bold mb-1">✓ Zero LocalStorage</div>
            <p className="text-slate-400 text-[11px]">No credentials ever touch browser storage, IndexedDB, cookies, or cache.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
            <div className="text-emerald-400 font-bold mb-1">✓ Zero Network Transmit</div>
            <p className="text-slate-400 text-[11px]">No external APIs, remote lookups, or third-party analytical telemetry.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
            <div className="text-emerald-400 font-bold mb-1">✓ Zero Console Logs</div>
            <p className="text-slate-400 text-[11px]">No console.log or plaintext exposures in memory or developer inspection tools.</p>
          </div>
        </div>
      </div>

      {/* System Architecture & Technology Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Stack Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white font-display">
              Technology Stack
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="font-semibold text-slate-200">Frontend Core</span>
              <span className="font-mono text-emerald-400">React 19 + TypeScript (Strict)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="font-semibold text-slate-200">Build System</span>
              <span className="font-mono text-emerald-400">Vite 8 (High-Performance Bundler)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="font-semibold text-slate-200">Design &amp; Styling</span>
              <span className="font-mono text-emerald-400">Tailwind CSS v4 + SOC Dark Aesthetics</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="font-semibold text-slate-200">Cryptography Standard</span>
              <span className="font-mono text-emerald-400">Web Crypto API (crypto.getRandomValues)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="font-semibold text-slate-200">Iconography</span>
              <span className="font-mono text-emerald-400">Lucide React Icons</span>
            </div>
          </div>
        </div>

        {/* Algorithm & Heuristics Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-display">
              Mathematical Heuristic Pipeline
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="font-bold text-slate-100 mb-1">1. Information Entropy (Bits)</div>
              <p className="text-slate-400">
                Calculated using Shannon information entropy: <code>E = L * log2(R)</code>, where <code>L</code> is length and <code>R</code> is character keyspace pool, adjusted for repetition and unique character ratios.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="font-bold text-slate-100 mb-1">2. Pattern &amp; Spatial Walk Detection</div>
              <p className="text-slate-400">
                Linear algorithms scan for contiguous ascending/descending numbers, alphabetical sequences, QWERTY physical keyboard walks, repeated substrings, and date formats.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="font-bold text-slate-100 mb-1">3. Leetspeak &amp; Dictionary Normalization</div>
              <p className="text-slate-400">
                Maps leetspeak characters (e.g. <code>@ &rarr; a, $ &rarr; s, 0 &rarr; o</code>) to unmask dictionary roots against top breached password datasets in O(1) time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Background / Portfolio Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-display">
          Academic Context &amp; Project Objective
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Developed as a cybersecurity engineering project to bridge the gap between abstract cryptographic principles and real-world authentication security. By demonstrating how human habits create predictable attack vectors, <strong>Password Strength Analyzer &amp; Secure Password Generator</strong> demonstrates why modern authentication security relies on high-entropy random generation and zero-knowledge architectures.
        </p>
      </div>
    </div>
  );
};
