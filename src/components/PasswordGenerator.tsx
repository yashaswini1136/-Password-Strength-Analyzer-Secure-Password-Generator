import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sliders, 
  ArrowRight, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { GeneratorOptions, PasswordAnalysisResult } from '../types/password';
import { generateSecurePassword, generateSecurePassphrase } from '../services/passwordGenerator';
import { analyzePassword } from '../services/passwordAnalyzer';
import { copySecurely, getScoreTheme } from '../utils/securityUtils';

interface PasswordGeneratorProps {
  onSendToAnalyzer?: (password: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onSendToAnalyzer }) => {
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    specialCharacters: true,
    excludeAmbiguous: false,
  });

  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [passphraseWordCount, setPassphraseWordCount] = useState<number>(4);
  const [passphraseSeparator, setPassphraseSeparator] = useState<string>('-');
  const [passphraseIncludeNumber, setPassphraseIncludeNumber] = useState<boolean>(true);

  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Analysis of the currently generated password
  const [analysis, setAnalysis] = useState<PasswordAnalysisResult>(() => analyzePassword(''));

  const handleGenerate = useCallback(() => {
    setErrorMessage(null);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);

    try {
      let pwd = '';
      if (mode === 'random') {
        pwd = generateSecurePassword(options);
      } else {
        pwd = generateSecurePassphrase(passphraseWordCount, passphraseSeparator, passphraseIncludeNumber);
      }

      setGeneratedPassword(pwd);
      const res = analyzePassword(pwd);
      setAnalysis(res);

      // Trigger subtle celebratory confetti if it's very strong and user clicked regenerate
      if (res.score >= 90) {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#10b981', '#34d399', '#059669', '#38bdf8']
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error generating password.');
      setGeneratedPassword('');
      setAnalysis(analyzePassword(''));
    }
  }, [options, mode, passphraseWordCount, passphraseSeparator, passphraseIncludeNumber]);

  // Generate on initial mount or when config changes
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopy = async () => {
    if (!generatedPassword) return;
    const ok = await copySecurely(generatedPassword);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOptionChange = (key: keyof GeneratorOptions, val: any) => {
    setOptions(prev => {
      const next = { ...prev, [key]: val };
      // Check if user turned off all 4 sets
      if (!next.uppercase && !next.lowercase && !next.numbers && !next.specialCharacters) {
        setErrorMessage('Select at least one character type.');
      } else {
        setErrorMessage(null);
      }
      return next;
    });
  };

  const theme = getScoreTheme(analysis.score);

  // Syntax highlighting for generated string
  const renderFormattedPassword = (pwd: string) => {
    return pwd.split('').map((char, index) => {
      let color = 'text-slate-200';
      if (/[0-9]/.test(char)) {
        color = 'text-amber-400 font-semibold';
      } else if (/[A-Z]/.test(char)) {
        color = 'text-emerald-400 font-bold';
      } else if (/[^a-zA-Z0-9]/.test(char)) {
        color = 'text-purple-400 font-bold';
      } else {
        color = 'text-slate-100';
      }
      return (
        <span key={index} className={color}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Mode Selection Pill: High-Entropy Random vs Memorable Passphrase */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('random')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'random'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Cryptographic Random String
          </button>
          <button
            type="button"
            onClick={() => setMode('passphrase')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'passphrase'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Memorable Diceware Passphrase
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>crypto.getRandomValues()</span>
        </div>
      </div>

      {/* Primary Display Card */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-slate-900/90 border transition-all ${theme.borderColor} ${theme.glowClass}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm uppercase tracking-wider font-bold text-slate-300">
              Generated Secure Credential
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {generatedPassword.length} characters
            </span>
            <span className={`text-xs uppercase font-mono font-bold px-2 py-0.5 rounded border ${theme.badgeBg}`}>
              {analysis.strengthLevel}
            </span>
          </div>
        </div>

        {/* Output Box */}
        <div className="relative p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between min-h-[72px] mb-4 group">
          <div className="font-mono text-lg sm:text-2xl tracking-wider select-all break-all overflow-x-auto pr-4">
            {errorMessage ? (
              <span className="text-rose-400 text-sm font-sans flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {errorMessage}
              </span>
            ) : showPassword ? (
              renderFormattedPassword(generatedPassword)
            ) : (
              <span className="text-slate-500 tracking-widest">
                {'•'.repeat(generatedPassword.length || 16)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide generated password' : 'Show generated password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-emerald-400" /> : <Eye className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              aria-label="Regenerate password"
              title="Regenerate password"
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isRotating ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Action Controls & Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!generatedPassword || !!errorMessage}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Password Copied Securely' : 'Copy Password'}</span>
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          {onSendToAnalyzer && generatedPassword && (
            <button
              type="button"
              onClick={() => onSendToAnalyzer(generatedPassword)}
              className="w-full sm:w-auto text-xs text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <span>Test in Strength Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Copy Toast Reassurance */}
        {copied && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Password copied securely.</strong> Never stored in browser history, storage, or external logs.
            </span>
          </div>
        )}
      </div>

      {/* Generator Configuration Options */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h4 className="text-base font-bold text-white font-display">
              Generator Parameters & Complexity Rules
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {mode === 'random' ? 'Character Sets' : 'Diceware Model'}
          </span>
        </div>

        {mode === 'random' ? (
          <>
            {/* Length Slider & Direct Numeric Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="password-length-slider" className="text-sm font-semibold text-slate-200">
                  Password Length:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={8}
                    max={64}
                    value={options.length}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 8;
                      handleOptionChange('length', Math.max(8, Math.min(64, val)));
                    }}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono text-sm text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                  />
                  <span className="text-xs text-slate-400">characters</span>
                </div>
              </div>

              <div className="relative">
                <input
                  id="password-length-slider"
                  type="range"
                  min={8}
                  max={64}
                  value={options.length}
                  onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>8 (Basic)</span>
                  <span>16 (Recommended)</span>
                  <span>32 (Strong)</span>
                  <span>64 (Paranoid)</span>
                </div>
              </div>
            </div>

            {/* Character Checkboxes */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Character Diversity Selection
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={options.uppercase}
                      onChange={(e) => handleOptionChange('uppercase', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Uppercase Letters</div>
                      <div className="text-[11px] text-slate-500 font-mono">A–Z (26 chars)</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-bold">ABC</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={options.lowercase}
                      onChange={(e) => handleOptionChange('lowercase', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Lowercase Letters</div>
                      <div className="text-[11px] text-slate-500 font-mono">a–z (26 chars)</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-bold">abc</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={options.numbers}
                      onChange={(e) => handleOptionChange('numbers', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Numeric Digits</div>
                      <div className="text-[11px] text-slate-500 font-mono">0–9 (10 chars)</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold">123</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={options.specialCharacters}
                      onChange={(e) => handleOptionChange('specialCharacters', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Special Symbols</div>
                      <div className="text-[11px] text-slate-500 font-mono">!@#$%^&* (33 chars)</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-purple-400 font-bold">!#$</span>
                </label>
              </div>
            </div>

            {/* Ambiguous characters toggle */}
            <div className="pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.excludeAmbiguous}
                    onChange={(e) => handleOptionChange('excludeAmbiguous', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      Exclude Ambiguous Characters
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Avoid easily confused characters: <code>O, 0, I, l, 1, |</code>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Optional
                </span>
              </label>
            </div>
          </>
        ) : (
          /* Passphrase configuration */
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200">
                  Word Count:
                </label>
                <span className="font-mono text-sm text-emerald-400 font-bold">
                  {passphraseWordCount} words
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={8}
                value={passphraseWordCount}
                onChange={(e) => setPassphraseWordCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3 words</span>
                <span>4 words (Default)</span>
                <span>6 words (High)</span>
                <span>8 words (Vault)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Word Separator
                </label>
                <select
                  value={passphraseSeparator}
                  onChange={(e) => setPassphraseSeparator(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono outline-none focus:border-emerald-500"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value=".">Period (.)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=" ">Space ( )</option>
                  <option value="#">Hash (#)</option>
                  <option value="$">Dollar ($)</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-300 font-medium">Include Random Digits</span>
                  <input
                    type="checkbox"
                    checked={passphraseIncludeNumber}
                    onChange={(e) => setPassphraseIncludeNumber(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cryptographic Assurance Footnote */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-200 font-semibold">Cryptographic Security Principle: </span>
          All random values are generated through <code>window.crypto.getRandomValues()</code> utilizing OS-level hardware entropy sources. Rejection sampling is enforced to prevent modulo bias. Never cached or transmitted.
        </div>
      </div>
    </div>
  );
};
