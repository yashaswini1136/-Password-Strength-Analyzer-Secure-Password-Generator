import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import type { NavTab } from './Header';

interface FooterProps {
  onTabChange: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 text-slate-400 no-print">
      {/* Privacy Guarantee Highlight Bar */}
      <div className="border-b border-slate-800/60 bg-emerald-950/20 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero-Knowledge Privacy Pledge:</strong> Your password is analyzed locally in your browser. Password Strength Analyzer &amp; Secure Password Generator does not send, upload, or store your entered password.
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-400/80 shrink-0">
            <span>Client-Side Only</span>
            <span>•</span>
            <span>No Telemetry</span>
            <span>•</span>
            <span>Web Crypto API</span>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: App Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white font-display">
                PASSWORD STRENGTH ANALYZER &amp; SECURE PASSWORD GENERATOR
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-300">
              A privacy-focused cybersecurity tool for password analysis and secure password generation
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A cybersecurity educational and defensive tool built to evaluate password entropy, identify dangerous sequential and keyboard patterns, check compromised wordlists, and generate cryptographically resilient credentials.
            </p>
            <p className="text-[11px] font-mono text-emerald-400/90 pt-1">
              “Analyze. Generate. Protect.”
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-3 font-display">
              Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('analyzer')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Password Strength Analyzer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('generator')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Secure Password Generator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('guide')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Security Guide &amp; Best Practices
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Project &amp; Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Security Principles */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-3 font-display">
              Security Compliance
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-400">✓</span> NIST SP 800-63B Guidelines
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-400">✓</span> OWASP Authentication Standards
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-400">✓</span> CSPRNG (Web Crypto API)
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-400">✓</span> Zero Server Transmission
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Year */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} PASSWORD STRENGTH ANALYZER &amp; SECURE PASSWORD GENERATOR. Cybersecurity Engineering &amp; Academic Portfolio Project.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for Computer Science &amp; Cybersecurity Evaluation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
