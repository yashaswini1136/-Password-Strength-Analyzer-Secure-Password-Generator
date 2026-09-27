import type { PasswordAnalysisResult, StrengthLevel } from '../types/password';
import { checkCommonPassword } from './commonPasswords';
import { detectAllWeakPatterns } from './patternDetector';
import { calculateEntropy, calculatePoolSize, estimateCrackTimes } from '../utils/securityUtils';

/**
 * Analyzes a password completely client-side.
 * Never transmits or stores the entered password.
 */
export function analyzePassword(password: string): PasswordAnalysisResult {
  // Empty password baseline
  if (!password || password.length === 0) {
    return {
      score: 0,
      strengthLevel: 'Very Weak',
      length: 0,
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSpecialCharacters: false,
      uppercaseCount: 0,
      lowercaseCount: 0,
      numberCount: 0,
      specialCount: 0,
      uniqueCharCount: 0,
      detectedPatterns: [],
      isCommonPassword: false,
      recommendations: [
        'Enter a password to evaluate security strength in real-time.',
        'Aim for at least 12–16 characters with diverse character types.'
      ],
      entropyBits: 0,
      charSetSize: 0,
      crackTimes: {
        onlineThrottled: 'Instantly',
        onlineUnthrottled: 'Instantly',
        offlineSlowHash: 'Instantly',
        offlineFastHash: 'Instantly'
      }
    };
  }

  // Gracefully handle extremely long inputs (e.g. copy-pasted files or 10,000+ chars)
  const trimmed = password.slice(0, 256);
  const length = trimmed.length;

  // Character breakdown
  const uppercaseMatches = trimmed.match(/[A-Z]/g) || [];
  const lowercaseMatches = trimmed.match(/[a-z]/g) || [];
  const numberMatches = trimmed.match(/[0-9]/g) || [];
  const specialMatches = trimmed.match(/[^a-zA-Z0-9]/g) || [];

  const uppercaseCount = uppercaseMatches.length;
  const lowercaseCount = lowercaseMatches.length;
  const numberCount = numberMatches.length;
  const specialCount = specialMatches.length;

  const hasUppercase = uppercaseCount > 0;
  const hasLowercase = lowercaseCount > 0;
  const hasNumbers = numberCount > 0;
  const hasSpecialCharacters = specialCount > 0;

  const uniqueChars = new Set(trimmed);
  const uniqueCharCount = uniqueChars.size;

  // Threat & Pattern checks
  const commonCheck = checkCommonPassword(trimmed);
  const detectedPatterns = detectAllWeakPatterns(trimmed);

  // Entropy & pool
  const charSetSize = calculatePoolSize(trimmed);
  const entropyBits = calculateEntropy(trimmed);
  const crackTimes = estimateCrackTimes(entropyBits, commonCheck.isCommon);

  // ================= SCORING ALGORITHM =================
  let score = 0;

  // 1. Length scoring (up to 45 points)
  if (length < 8) {
    score += length * 2.5; // max 17.5
  } else if (length <= 11) {
    score += 20 + (length - 8) * 4; // 20 - 32
  } else if (length <= 15) {
    score += 34 + (length - 12) * 2.5; // 34 - 41.5
  } else if (length <= 20) {
    score += 42 + (length - 16) * 1.5; // 42 - 48
  } else {
    score += 50; // max length contribution
  }

  // 2. Character Variety (up to 30 points)
  const categoriesPresent = [hasUppercase, hasLowercase, hasNumbers, hasSpecialCharacters].filter(Boolean).length;
  if (categoriesPresent === 1) {
    score += 4;
  } else if (categoriesPresent === 2) {
    score += 12;
  } else if (categoriesPresent === 3) {
    score += 22;
  } else if (categoriesPresent === 4) {
    score += 30;
  }

  // 3. Balance & Distribution bonus (up to 15 points)
  if (uppercaseCount >= 2 && lowercaseCount >= 2) score += 4;
  if (numberCount >= 2) score += 4;
  if (specialCount >= 2) score += 5;
  if (uniqueCharCount >= Math.min(length * 0.75, 16)) score += 5;

  // 4. Entropy bonus (up to 10 points)
  if (entropyBits >= 80) score += 10;
  else if (entropyBits >= 60) score += 6;
  else if (entropyBits >= 40) score += 3;

  // 5. Severe penalties for weaknesses & patterns
  for (const pattern of detectedPatterns) {
    switch (pattern.severity) {
      case 'critical':
        score -= 30;
        break;
      case 'high':
        score -= 18;
        break;
      case 'medium':
        score -= 10;
        break;
      case 'low':
        score -= 5;
        break;
    }
  }

  // 6. Common password penalty
  if (commonCheck.isExactMatch) {
    // Top leaked passwords can never be above 15
    score = Math.min(score, 10);
  } else if (commonCheck.isDerivedMatch) {
    // Leetspeak of top leaked passwords capped at 25
    score = Math.min(score, 24);
  }

  // Length constraints
  if (length < 8) {
    score = Math.min(score, 25);
  } else if (length < 12 && categoriesPresent <= 2) {
    score = Math.min(score, 45);
  }

  // Clamp 0 - 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine Strength Category
  let strengthLevel: StrengthLevel = 'Very Weak';
  if (score >= 81) {
    strengthLevel = 'Very Strong';
  } else if (score >= 61) {
    strengthLevel = 'Strong';
  } else if (score >= 41) {
    strengthLevel = 'Medium';
  } else if (score >= 21) {
    strengthLevel = 'Weak';
  } else {
    strengthLevel = 'Very Weak';
  }

  // ================= DYNAMIC RECOMMENDATIONS =================
  const recommendations: string[] = [];

  // Common password warning
  if (commonCheck.isCommon) {
    recommendations.push(
      commonCheck.message ||
      'This password appears in common breached password lists. Attackers test these first. Choose a unique password.'
    );
  }

  // Length recommendations
  if (length < 8) {
    recommendations.push('Critical: Password is too short. Use at least 12–16 characters to prevent brute-force cracking.');
  } else if (length < 12) {
    recommendations.push('Increase length to 12–16+ characters to significantly expand search space.');
  }

  // Character variety recommendations
  if (!hasUppercase) {
    recommendations.push('Add uppercase characters (A–Z) to increase character diversity.');
  }
  if (!hasLowercase) {
    recommendations.push('Add lowercase characters (a–z).');
  }
  if (!hasNumbers) {
    recommendations.push('Include numbers (0–9) placed unpredictably throughout the password.');
  }
  if (!hasSpecialCharacters) {
    recommendations.push('Add special characters such as !, @, #, $, %, ^, &, or *.');
  }

  // Pattern specific recommendations
  const patternTypes = new Set(detectedPatterns.map(p => p.type));
  if (patternTypes.has('sequential')) {
    recommendations.push('Avoid predictable sequential characters such as 123456, 987654, or abcdef.');
  }
  if (patternTypes.has('repeated')) {
    recommendations.push('Avoid repeated characters (e.g. aaaaa or 1111); repetition sharply reduces mathematical complexity.');
  }
  if (patternTypes.has('keyboard')) {
    recommendations.push('Avoid physical keyboard walk patterns (e.g. qwerty, asdfgh) which are prioritized by cracking tools.');
  }
  if (patternTypes.has('substitution')) {
    recommendations.push('Do not rely on simple character substitutions (like @ for a, $ for s) — automated rule lists reverse them instantly.');
  }
  if (patternTypes.has('date')) {
    recommendations.push('Avoid birth years or calendar dates (e.g. 1998, 2024) which are vulnerable to targeted OSINT profiling.');
  }
  if (patternTypes.has('structure')) {
    recommendations.push('Avoid the standard "Word + Number + Symbol" structure (e.g., Summer2024!). Use random generation or long passphrases.');
  }

  // Positive reinforcement if strong
  if (score >= 80 && recommendations.length === 0) {
    recommendations.push('Excellent password complexity and cryptographic entropy.');
    recommendations.push('Ensure you do not reuse this credential across multiple services.');
    recommendations.push('Store securely in an encrypted offline or zero-knowledge password manager.');
  } else if (recommendations.length === 0) {
    recommendations.push('Consider lengthening your password with unpredictable words or symbols.');
  }

  return {
    score,
    strengthLevel,
    length,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialCharacters,
    uppercaseCount,
    lowercaseCount,
    numberCount,
    specialCount,
    uniqueCharCount,
    detectedPatterns,
    isCommonPassword: commonCheck.isCommon,
    commonPasswordMatch: commonCheck.matchedWord,
    commonPasswordRank: commonCheck.rank,
    recommendations,
    entropyBits,
    charSetSize,
    crackTimes
  };
}
