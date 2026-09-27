import type { StrengthLevel, CrackTimeEstimates, SecurityReportData } from '../types/password';

/**
 * Calculates pool size based on character variety present in password
 */
export function calculatePoolSize(password: string): number {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  // Special characters standard set
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;
  return pool === 0 ? 1 : pool;
}

/**
 * Calculates Shannon / Information Entropy in bits
 * Formula: E = L * log2(R)
 * With deduction for low unique character ratios
 */
export function calculateEntropy(password: string): number {
  if (!password || password.length === 0) return 0;

  const pool = calculatePoolSize(password);
  const rawEntropy = password.length * Math.log2(pool);

  // Uniqueness penalty
  const uniqueCount = new Set(password).size;
  const uniquenessRatio = uniqueCount / password.length;

  // If password has many repeated characters, penalize entropy
  const adjustedEntropy = rawEntropy * (0.6 + 0.4 * uniquenessRatio);

  return Math.round(adjustedEntropy * 10) / 10;
}

/**
 * Converts a duration in seconds to a human-friendly string
 */
export function formatTimeSpan(seconds: number): string {
  if (seconds < 1) return "Instantly (< 1 sec)";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} days`;
  
  const months = days / 30.44;
  if (months < 12) return `${Math.round(months)} months`;
  
  const years = days / 365.25;
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 1000) return `${Math.round(years / 100) * 100} years`;
  if (years < 1000000) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1000000000) return `${Math.round(years / 1000000)} million years`;
  if (years < 1000000000000) return `${Math.round(years / 1000000000)} billion years`;
  return "Centuries of cosmic time";
}

/**
 * Estimates brute-force crack times for various realistic threat models
 */
export function estimateCrackTimes(entropyBits: number, isCommon: boolean): CrackTimeEstimates {
  if (isCommon || entropyBits <= 10) {
    return {
      onlineThrottled: "Minutes (via top wordlists)",
      onlineUnthrottled: "Instantly (< 1 sec)",
      offlineSlowHash: "Instantly (< 1 sec)",
      offlineFastHash: "Instantly (< 1 sec)",
    };
  }

  // Combinations = 2 ^ entropyBits
  // Average attempts required = Combinations / 2
  const combinations = Math.pow(2, Math.min(entropyBits, 128));
  const avgGuesses = combinations / 2;

  // Speeds:
  // 1. Online throttled: 100 attempts / hour = 0.0277 guesses / sec
  const throttledSpeed = 100 / 3600;
  // 2. Online unthrottled: 100 guesses / sec
  const unthrottledSpeed = 100;
  // 3. Offline slow hash (bcrypt cost 10, Argon2id): 10,000 / sec
  const slowHashSpeed = 10000;
  // 4. Offline fast hash (Modern multi-GPU Hashcat rig, e.g. 8x RTX 4090 ~ 100 Billion NTLM/MD5/SHA256 guesses/sec):
  const fastHashSpeed = 100000000000;

  return {
    onlineThrottled: formatTimeSpan(avgGuesses / throttledSpeed),
    onlineUnthrottled: formatTimeSpan(avgGuesses / unthrottledSpeed),
    offlineSlowHash: formatTimeSpan(avgGuesses / slowHashSpeed),
    offlineFastHash: formatTimeSpan(avgGuesses / fastHashSpeed),
  };
}

/**
 * Copies text securely to clipboard using navigator.clipboard
 */
export async function copySecurely(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    // Fallback for older environments
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch {
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns color classes corresponding to strength score
 */
export function getScoreTheme(score: number): {
  color: string;
  bgLight: string;
  borderColor: string;
  badgeBg: string;
  barColor: string;
  glowClass: string;
  label: StrengthLevel;
} {
  if (score <= 20) {
    return {
      color: "text-rose-400",
      bgLight: "bg-rose-500/10",
      borderColor: "border-rose-500/30",
      badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      barColor: "bg-rose-500",
      glowClass: "cyber-glow-red",
      label: "Very Weak"
    };
  }
  if (score <= 40) {
    return {
      color: "text-orange-400",
      bgLight: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      badgeBg: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      barColor: "bg-orange-500",
      glowClass: "cyber-glow-amber",
      label: "Weak"
    };
  }
  if (score <= 60) {
    return {
      color: "text-amber-400",
      bgLight: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      barColor: "bg-amber-500",
      glowClass: "cyber-glow-amber",
      label: "Medium"
    };
  }
  if (score <= 80) {
    return {
      color: "text-blue-400",
      bgLight: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      barColor: "bg-blue-500",
      glowClass: "cyber-glow-blue",
      label: "Strong"
    };
  }
  return {
    color: "text-emerald-400",
    bgLight: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    barColor: "bg-emerald-500",
    glowClass: "cyber-glow-emerald",
    label: "Very Strong"
  };
}

/**
 * Generates plain text security report for download
 * IMPORTANT: NEVER includes the actual password
 */
export function generatePlainTextReport(report: SecurityReportData): string {
  const patternLines = report.detectedPatterns.length > 0
    ? report.detectedPatterns.map(p => `  * [${p.severity.toUpperCase()}] ${p.name}: ${p.description}`).join('\n')
    : "  * None detected (No known predictable vulnerabilities)";

  const recLines = report.recommendations.map(r => `  * ${r}`).join('\n');

  return `===================================================================
PASSWORD STRENGTH ANALYZER & SECURE PASSWORD GENERATOR
Security Analysis Audit Report
Generated: ${report.generatedAt}
Client-Side Local Analysis Only (Zero Data Transmitted)
===================================================================

[1] OVERALL SECURITY RATING
-------------------------------------------------------------------
Security Score: ${report.score} / 100
Strength Classification: ${report.strengthLevel.toUpperCase()}
Information Entropy: ${report.entropyBits} bits
Estimated Crack Time (Multi-GPU Cluster): ${report.crackTimeOfflineGPU}

[2] STRUCTURAL METRICS
-------------------------------------------------------------------
Password Length: ${report.length} characters
Uppercase Letters: ${report.hasUppercase ? 'YES' : 'NO'}
Lowercase Letters: ${report.hasLowercase ? 'YES' : 'NO'}
Numeric Digits: ${report.hasNumbers ? 'YES' : 'NO'}
Special Characters: ${report.hasSpecialCharacters ? 'YES' : 'NO'}
Unique Characters: ${report.uniqueChars} characters

[3] THREAT DETECTION & PATTERNS
-------------------------------------------------------------------
Common Password Database: ${report.isCommonPassword ? 'FLAGGED AS COMPROMISED / HIGH RISK' : 'CLEAN (Not in top leaked lists)'}
${report.commonPasswordNote ? `Note: ${report.commonPasswordNote}\n` : ''}Detected Patterns:
${patternLines}

[4] ACTIONABLE SECURITY RECOMMENDATIONS
-------------------------------------------------------------------
${recLines}

===================================================================
CONFIDENTIALITY NOTICE:
For user privacy and zero-knowledge compliance, the actual password
is NEVER stored, transmitted over networks, or printed in this report.
Built with Web Crypto API and local heuristics.
===================================================================`;
}
