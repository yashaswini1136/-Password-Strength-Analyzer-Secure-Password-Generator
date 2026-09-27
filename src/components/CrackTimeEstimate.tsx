import React from 'react';
import { Clock, ShieldAlert, Cpu, Globe, Server, AlertTriangle } from 'lucide-react';
import type { CrackTimeEstimates } from '../types/password';

interface CrackTimeEstimateProps {
  crackTimes: CrackTimeEstimates;
  isCommon: boolean;
  length: number;
}

export const CrackTimeEstimate: React.FC<CrackTimeEstimateProps> = ({ crackTimes, isCommon, length }) => {
  if (length === 0) return null;

  return (
    <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            Estimated Brute-Force Cracking Times
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Theoretical Search Space Exhaustion
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Scenario 1: Online Throttled */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Online (Throttled)</span>
            </div>
            <div className="text-[11px] text-slate-500 mb-2">
              ~100 attempts / hour (Rate-limited login)
            </div>
          </div>
          <div className="text-sm font-bold font-mono text-slate-200">
            {crackTimes.onlineThrottled}
          </div>
        </div>

        {/* Scenario 2: Online Unthrottled */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Server className="w-3.5 h-3.5 text-amber-400" />
              <span>Online (Unthrottled)</span>
            </div>
            <div className="text-[11px] text-slate-500 mb-2">
              ~100 attempts / sec (Unprotected API)
            </div>
          </div>
          <div className="text-sm font-bold font-mono text-slate-200">
            {crackTimes.onlineUnthrottled}
          </div>
        </div>

        {/* Scenario 3: Offline Slow Hash */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Offline (Slow Hash)</span>
            </div>
            <div className="text-[11px] text-slate-500 mb-2">
              ~10,000 / sec (bcrypt, Argon2, scrypt)
            </div>
          </div>
          <div className="text-sm font-bold font-mono text-slate-200">
            {crackTimes.offlineSlowHash}
          </div>
        </div>

        {/* Scenario 4: Fast Hash GPU Cluster */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Multi-GPU Cluster</span>
            </div>
            <div className="text-[11px] text-slate-500 mb-2">
              ~100 Billion / sec (Fast Hashcat rig)
            </div>
          </div>
          <div className={`text-sm font-bold font-mono ${isCommon ? 'text-rose-400' : 'text-slate-200'}`}>
            {crackTimes.offlineFastHash}
          </div>
        </div>
      </div>

      {isCommon && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>
            <strong>Dictionary Threat:</strong> Because this password is known or derived from leaked lists, attackers bypass mathematical brute-force completely using wordlists and rule-based permutation masks.
          </span>
        </div>
      )}
    </div>
  );
};
