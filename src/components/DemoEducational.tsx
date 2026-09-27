import React from 'react';
import { PlayCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface DemoEducationalProps {
  onSelectExample: (password: string) => void;
}

export const DemoEducational: React.FC<DemoEducationalProps> = ({ onSelectExample }) => {
  const examples = [
    {
      level: 'Weak',
      sample: 'password123',
      scoreText: '10/100',
      description: 'Common dictionary word + sequential numeric suffix. Cracked in <1 ms.',
      colorClass: 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:border-rose-400',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      level: 'Medium',
      sample: 'Alex@Demo456',
      scoreText: '42/100',
      description: 'Classic policy compliance: Fictional name + special + sequential 456. High pattern risk.',
      colorClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-400',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      level: 'Strong',
      sample: 'River!Moon7$Cloud#',
      scoreText: '78/100',
      description: 'Passphrase structure with 4 categories, high length, but recognizable word stems.',
      colorClass: 'border-blue-500/30 bg-blue-500/10 text-blue-300 hover:border-blue-400',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      level: 'Very Strong',
      sample: 'X7@mQ9#vL2!pR8$K',
      scoreText: '96/100',
      description: 'Cryptographically generated random 16-character string. 96+ bits of entropy.',
      colorClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
  ];

  return (
    <div className="w-full bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            Educational Demonstration Benchmarks
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Click any preset to test the analysis engine
        </span>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4 flex items-center gap-2 text-xs text-amber-300/90">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Educational Notice:</strong> These presets are publicly demonstrated testing samples for evaluating analyzer logic. <em>Never use these example passwords for any real accounts.</em>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {examples.map((item) => (
          <button
            key={item.level}
            type="button"
            onClick={() => onSelectExample(item.sample)}
            className={`p-3.5 rounded-xl border text-left transition-all group flex flex-col justify-between ${item.colorClass}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded border ${item.badgeClass}`}>
                  {item.level}
                </span>
                <span className="text-xs font-mono font-semibold opacity-80">
                  {item.scoreText}
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-white mb-1.5 flex items-center justify-between">
                <span className="truncate">{item.sample}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {item.description}
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono font-medium text-slate-400 group-hover:text-white flex items-center gap-1">
              <span>Test Preset &rarr;</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
