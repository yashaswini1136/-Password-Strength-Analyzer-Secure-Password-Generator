import type { DetectedPattern } from '../types/password';
import { normalizeLeetspeak } from './commonPasswords';

// QWERTY keyboard row sequences (forward & backward)
const KEYBOARD_PATTERNS = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1234567890",
  "!@#$%^&*()",
  // Common diagonal patterns
  "qazwsxedcrfvtgbyhnujmikolp",
  "zaq12wsx3edc4rfv5tgb",
  "1qaz2wsx3edc",
  // Reverse rows
  "poiuytrewq",
  "lkjhgfdsa",
  "mnbvcxz",
  "0987654321"
];

/**
 * Detects sequential numbers (e.g., 12345, 65432, 7890)
 */
function detectSequentialNumbers(password: string): DetectedPattern | null {
  const digits = password.replace(/\D/g, '');
  if (digits.length < 3) return null;

  let maxSeq = 1;
  let currentSeq = 1;

  for (let i = 1; i < digits.length; i++) {
    const diff = digits.charCodeAt(i) - digits.charCodeAt(i - 1);
    if (diff === 1 || diff === -1) {
      currentSeq++;
      if (currentSeq > maxSeq) maxSeq = currentSeq;
    } else {
      currentSeq = 1;
    }
  }

  // Also check circular sequence 8901, 9012 or direct substrings in sequence
  const forwardSeq = "01234567890123";
  const reverseSeq = "09876543210987";
  const lower = password.toLowerCase();

  for (let len = 3; len <= 8; len++) {
    for (let i = 0; i <= forwardSeq.length - len; i++) {
      const sub = forwardSeq.substring(i, i + len);
      if (lower.includes(sub)) {
        return {
          id: 'seq-num-forward',
          name: 'Sequential Numbers',
          type: 'sequential',
          description: `Predictable ascending number series detected ("${sub}").`,
          detail: 'Sequential numeric sequences are scanned in the first millisecond of brute-force dictionary attacks.',
          severity: sub.length >= 4 ? 'high' : 'medium'
        };
      }
    }
    for (let i = 0; i <= reverseSeq.length - len; i++) {
      const sub = reverseSeq.substring(i, i + len);
      if (lower.includes(sub)) {
        return {
          id: 'seq-num-reverse',
          name: 'Reverse Sequential Numbers',
          type: 'sequential',
          description: `Predictable descending number series detected ("${sub}").`,
          detail: 'Reverse numeric sequences are common variations easily cracked by automated hashcat rule-engines.',
          severity: sub.length >= 4 ? 'high' : 'medium'
        };
      }
    }
  }

  if (maxSeq >= 3) {
    return {
      id: 'seq-num',
      name: 'Sequential Numbers',
      type: 'sequential',
      description: `Contains a sequence of ${maxSeq} consecutive numerical digits.`,
      detail: 'Avoid consecutive numbers like 12345 or 54321.',
      severity: maxSeq >= 4 ? 'high' : 'medium'
    };
  }

  return null;
}

/**
 * Detects sequential alphabet letters (e.g. abcde, fedcba)
 */
function detectSequentialLetters(password: string): DetectedPattern | null {
  const clean = password.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length < 3) return null;

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const reverseAlphabet = "zyxwvutsrqponmlkjihgfedcba";

  for (let len = 3; len <= 6; len++) {
    for (let i = 0; i <= alphabet.length - len; i++) {
      const seq = alphabet.substring(i, i + len);
      if (clean.includes(seq)) {
        return {
          id: 'seq-alpha',
          name: 'Sequential Alphabetical Characters',
          type: 'sequential',
          description: `Predictable alphabetical sequence found ("${seq}").`,
          detail: 'Consecutive alphabetical letters significantly reduce entropy.',
          severity: len >= 4 ? 'high' : 'medium'
        };
      }
    }
    for (let i = 0; i <= reverseAlphabet.length - len; i++) {
      const seq = reverseAlphabet.substring(i, i + len);
      if (clean.includes(seq)) {
        return {
          id: 'seq-alpha-rev',
          name: 'Reverse Sequential Alphabet',
          type: 'sequential',
          description: `Reverse alphabetical sequence found ("${seq}").`,
          detail: 'Reverse alphabetical patterns are trivial for dictionary generators.',
          severity: len >= 4 ? 'high' : 'medium'
        };
      }
    }
  }

  return null;
}

/**
 * Detects repeated characters (e.g. aaaaaa, 111111, !!!)
 */
function detectRepeatedCharacters(password: string): DetectedPattern | null {
  if (password.length < 3) return null;

  // Check 3 or more identical consecutive characters
  const consecutiveMatch = password.match(/(.)\1{2,}/);
  if (consecutiveMatch) {
    const char = consecutiveMatch[1];
    const count = consecutiveMatch[0].length;
    return {
      id: 'repeated-consecutive',
      name: 'Repeated Identical Characters',
      type: 'repeated',
      description: `Character "${char}" repeated ${count} times consecutively.`,
      detail: 'Consecutive repeated characters create severe entropy deficits.',
      severity: count >= 4 ? 'high' : 'medium'
    };
  }

  // Check character frequency dominance (e.g. "a1a2a3a4" where 'a' is 50% of password)
  const counts: Record<string, number> = {};
  for (const char of password) {
    counts[char] = (counts[char] || 0) + 1;
  }
  for (const [char, count] of Object.entries(counts)) {
    if (count >= 4 && count / password.length > 0.45) {
      return {
        id: 'repeated-dominant',
        name: 'Dominant Repeated Character',
        type: 'repeated',
        description: `Character "${char}" accounts for over 45% of total password length.`,
        detail: 'High repetition makes passwords vulnerable to frequency analysis.',
        severity: 'medium'
      };
    }
  }

  return null;
}

/**
 * Detects repeated words or chunks (e.g. passpass, 123123, abcabc, adminadmin)
 */
function detectRepeatedChunks(password: string): DetectedPattern | null {
  if (password.length < 4) return null;

  const lower = password.toLowerCase();

  // Halves repetition: e.g. "passpass", "12341234"
  if (lower.length % 2 === 0) {
    const half = lower.length / 2;
    if (lower.substring(0, half) === lower.substring(half)) {
      return {
        id: 'repeated-chunk-half',
        name: 'Repeated Halves / Word Doubling',
        type: 'repeated',
        description: `Entire password is a duplicated pattern: "${password.substring(0, half)}".`,
        detail: 'Duplicating a word or pattern does not double cryptographic security.',
        severity: 'high'
      };
    }
  }

  // Substring chunks of length 2-5 repeating at least 3 times
  for (let len = 2; len <= 4; len++) {
    for (let i = 0; i <= lower.length - len * 3; i++) {
      const chunk = lower.substring(i, i + len);
      const triple = chunk + chunk + chunk;
      if (lower.includes(triple)) {
        return {
          id: 'repeated-ngram',
          name: 'Repeating Syllable / Pattern Block',
          type: 'repeated',
          description: `Pattern block "${chunk}" repeats multiple times in sequence.`,
          detail: 'Repeating sub-patterns are standard targets of Markov model cracking tools.',
          severity: 'medium'
        };
      }
    }
  }

  return null;
}

/**
 * Detects keyboard walks (e.g. qwerty, asdfgh, zxcvbn)
 */
function detectKeyboardWalks(password: string): DetectedPattern | null {
  const lower = password.toLowerCase();

  for (const row of KEYBOARD_PATTERNS) {
    for (let len = 4; len <= 8; len++) {
      for (let i = 0; i <= row.length - len; i++) {
        const sub = row.substring(i, i + len);
        if (lower.includes(sub)) {
          return {
            id: 'keyboard-walk',
            name: 'Keyboard Walk Pattern',
            type: 'keyboard',
            description: `Keyboard layout sequence detected ("${sub}").`,
            detail: 'Adjacent physical keys on standard keyboards (like QWERTY) are heavily tested in wordlists.',
            severity: len >= 5 ? 'high' : 'medium'
          };
        }
      }
    }
  }

  return null;
}

/**
 * Detects date-like patterns (e.g. 1999, 2024, 01011995, 20251231)
 */
function detectDatePatterns(password: string): DetectedPattern | null {
  // Check 4-digit years between 1940 and 2035
  const yearMatch = password.match(/(19[4-9]\d|20[0-3]\d)/);
  if (yearMatch) {
    return {
      id: 'date-year',
      name: 'Four-Digit Year Detected',
      type: 'date',
      description: `Contains potential calendar year "${yearMatch[0]}".`,
      detail: 'Attackers commonly append birth years, anniversary years, or current graduation/fiscal years.',
      severity: 'medium'
    };
  }

  // Check 8-digit or 6-digit full dates (DDMMYYYY, MMDDYYYY, YYYYMMDD)
  const fullDateMatch = password.match(/(\d{2}[-/.]?\d{2}[-/.]?(?:19|20)\d{2}|(?:19|20)\d{2}[-/.]?\d{2}[-/.]?\d{2})/);
  if (fullDateMatch) {
    return {
      id: 'date-full',
      name: 'Full Date Structure',
      type: 'date',
      description: `Identified calendar date format "${fullDateMatch[0]}".`,
      detail: 'Dates of birth or significant events are routinely generated in targeted OSINT attacks.',
      severity: 'high'
    };
  }

  return null;
}

/**
 * Detects common password structures (e.g. Capital word + numbers + special char, e.g. Alex@Demo456, Password123)
 */
function detectPredictableStructure(password: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  // Pattern: Starts with Capital letter, followed by lowercase, ending in predictable number (e.g. Admin123, Welcome1)
  if (/^[A-Z][a-z]+(123|1234|1|12|01|99|007|!|@|#)$/.test(password)) {
    patterns.push({
      id: 'struct-classic-policy',
      name: 'Predictable Policy-Compliance Structure',
      type: 'structure',
      description: 'Capitalized word followed by simple numbers/special character.',
      detail: 'This is the #1 human habit when forced to meet arbitrary corporate password complexity rules.',
      severity: 'high'
    });
  }

  // Predictable numeric suffix e.g. "something123"
  if (/(123|1234|12345|111|000|01|99)$/.test(password)) {
    patterns.push({
      id: 'struct-numeric-suffix',
      name: 'Predictable Numeric Suffix',
      type: 'structure',
      description: 'Ends with a common consecutive or repeating number sequence.',
      detail: 'Attackers append 1, 12, 123, etc., automatically using mask attacks.',
      severity: 'medium'
    });
  }

  // Email or Username like structure
  if (/@\w+\.(com|net|org|edu|io)/i.test(password)) {
    patterns.push({
      id: 'struct-email',
      name: 'Email Address / Domain Format',
      type: 'username',
      description: 'Password resembles an email address or domain name.',
      detail: 'Never use email addresses or company handles as credentials.',
      severity: 'critical'
    });
  }

  return patterns;
}

/**
 * Detects common leetspeak substitutions (e.g. p@ssword, pa$$word, p@55w0rd)
 */
function detectLeetspeakSubstitutions(password: string): DetectedPattern | null {
  const normalized = normalizeLeetspeak(password);
  
  // If normalized password became a known bad word or dictionary word
  const badWords = ["password", "admin", "welcome", "qwerty", "iloveyou", "dragon", "secret", "master"];
  for (const word of badWords) {
    if (normalized.includes(word) && !password.toLowerCase().includes(word)) {
      return {
        id: 'substitution-leetspeak',
        name: 'Common Leetspeak Substitution',
        type: 'substitution',
        description: `Substituted characters (like @ for a, $ for s) masking common word "${word}".`,
        detail: 'Simple character substitutions are built directly into standard John the Ripper and Hashcat rule lists.',
        severity: 'high'
      };
    }
  }

  return null;
}

/**
 * Main pattern detection orchestrator
 */
export function detectAllWeakPatterns(password: string): DetectedPattern[] {
  if (!password || password.length === 0) return [];

  const results: DetectedPattern[] = [];

  const seqNum = detectSequentialNumbers(password);
  if (seqNum) results.push(seqNum);

  const seqAlpha = detectSequentialLetters(password);
  if (seqAlpha) results.push(seqAlpha);

  const repeated = detectRepeatedCharacters(password);
  if (repeated) results.push(repeated);

  const repeatedChunks = detectRepeatedChunks(password);
  if (repeatedChunks) results.push(repeatedChunks);

  const keyboard = detectKeyboardWalks(password);
  if (keyboard) results.push(keyboard);

  const leet = detectLeetspeakSubstitutions(password);
  if (leet) results.push(leet);

  const date = detectDatePatterns(password);
  if (date) results.push(date);

  const struct = detectPredictableStructure(password);
  results.push(...struct);

  return results;
}
