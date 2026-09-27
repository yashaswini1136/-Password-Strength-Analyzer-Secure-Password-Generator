import React, { useState } from 'react';
import { Eye, EyeOff, X, Clipboard, ShieldCheck, KeyRound } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  isCommonPassword?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Type or paste a password to analyze...',
  isCommonPassword = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setPasteNotice(true);
        setTimeout(() => setPasteNotice(false), 2000);
      }
    } catch {
      // Clipboard read permission might be denied or unsupported
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="password-analyzer-input" className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <span>Enter Password to Evaluate</span>
        </label>
        
        <div className="flex items-center gap-2">
          {pasteNotice && (
            <span className="text-xs text-emerald-400 font-mono animate-fade-in">
              Pasted from clipboard
            </span>
          )}
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {value.length} {value.length === 1 ? 'char' : 'chars'}
          </span>
        </div>
      </div>

      <div className="relative group">
        <input
          id="password-analyzer-input"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-lpignore="true"
          className={`w-full px-4 py-3.5 pr-28 rounded-xl bg-slate-900/90 text-slate-100 placeholder-slate-500 font-mono text-base border transition-all outline-none ${
            isCommonPassword
              ? 'border-rose-500/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-800 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 group-hover:border-slate-700'
          }`}
        />

        {/* Action buttons inside input right corner */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear entered password"
              title="Clear password"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePaste}
              aria-label="Paste from clipboard"
              title="Paste from clipboard"
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Security reassurance banner */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-400/90">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Knowledge: Analyzed strictly in your browser. Never transmitted or logged.</span>
        </div>
        {value.length > 32 && (
          <span className="text-amber-400 text-[11px] font-mono">
            High Length (+Entropy)
          </span>
        )}
      </div>
    </div>
  );
};
