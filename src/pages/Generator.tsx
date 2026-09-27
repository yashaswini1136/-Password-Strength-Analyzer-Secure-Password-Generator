import React from 'react';
import { PasswordGenerator } from '../components/PasswordGenerator';
import { Cpu, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

interface GeneratorPageProps {
  onSendToAnalyzer: (password: string) => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ onSendToAnalyzer }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>CSPRNG Hardware Entropy Generator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Secure Password Generator
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Generate mathematically resilient, cryptographically random credentials powered by your browser's <code className="text-emerald-400">crypto.getRandomValues()</code>. Eliminates human cognitive bias and predictable structural patterns.
          </p>
        </div>
      </div>

      {/* Main Password Generator Tool */}
      <PasswordGenerator onSendToAnalyzer={onSendToAnalyzer} />

      {/* Educational Deep Dive Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Panel 1: CSPRNG vs Math.random */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Why Math.random() is Insecure</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standard <code>Math.random()</code> uses pseudo-random algorithms (such as xorshift128+) designed strictly for graphical speed, not security. Given a few consecutive outputs, attackers can reverse-engineer internal states and predict all subsequent passwords.
          </p>
          <div className="text-[11px] font-mono text-emerald-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            Password Strength Analyzer &amp; Secure Password Generator strictly relies on Web Crypto API OS hardware entropy pools.
          </div>
        </div>

        {/* Panel 2: Rejection Sampling */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
            <Zap className="w-4 h-4 shrink-0" />
            <span>Zero Modulo Bias</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Naïve generators use <code>rand % length</code>, which unfairly favors lower-index characters whenever the pool size does not evenly divide 256. This tool implements <strong>rejection sampling</strong> to ensure every character has mathematically identical probability.
          </p>
          <div className="text-[11px] font-mono text-blue-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            Guarantees uniform Shannon entropy across all character subsets.
          </div>
        </div>

        {/* Panel 3: NIST SP 800-63B */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>NIST Recommendation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Modern security standards (NIST SP 800-63B) favor <strong>high character length (16–64 chars)</strong> or <strong>multi-word passphrases</strong> over frequent mandatory resets and convoluted arbitrary rules. Length exponentializes brute-force resistance.
          </p>
          <div className="text-[11px] font-mono text-emerald-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            A 16-character random string requires millennia to crack.
          </div>
        </div>
      </div>
    </div>
  );
};
