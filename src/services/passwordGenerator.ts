import type { GeneratorOptions } from '../types/password';

// Standard character sets
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';

// Ambiguous characters to optionally exclude: O, 0, I, l, 1, |, etc.
const AMBIGUOUS_CHARS = new Set(['O', '0', 'I', 'l', '1', '|', '`', "'", '"', ';', ':']);

/**
 * Generates an unbiased cryptographically secure random integer in range [0, max - 1]
 * Uses Web Crypto API rejection sampling to eliminate modulo bias.
 */
function getSecureRandomInt(max: number): number {
  if (max <= 1) return 0;
  
  // Rejection sampling bound
  const limit = Math.floor(256 / max) * max;
  const buffer = new Uint8Array(1);
  const cryptoObj = typeof window !== 'undefined' && window.crypto ? window.crypto : globalThis.crypto;

  while (true) {
    cryptoObj.getRandomValues(buffer);
    const val = buffer[0];
    if (val < limit) {
      return val % max;
    }
  }
}

/**
 * Shuffles an array in-place using Fisher-Yates shuffle with Web Crypto API
 */
function secureShuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Generates a cryptographically secure random password based on user specifications.
 * Uses Web Crypto API (crypto.getRandomValues).
 * Guarantees at least one character from each selected category.
 */
export function generateSecurePassword(options: GeneratorOptions): string {
  const { length, uppercase, lowercase, numbers, specialCharacters, excludeAmbiguous } = options;

  if (length < 4 || length > 128) {
    throw new Error('Password length must be between 4 and 128 characters.');
  }

  // Filter sets based on ambiguous flag
  const filterAmbiguous = (set: string) => {
    if (!excludeAmbiguous) return set;
    return set.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
  };

  const selectedSets: { name: string; chars: string }[] = [];

  if (uppercase) {
    const chars = filterAmbiguous(UPPERCASE_CHARS);
    if (chars.length > 0) selectedSets.push({ name: 'uppercase', chars });
  }
  if (lowercase) {
    const chars = filterAmbiguous(LOWERCASE_CHARS);
    if (chars.length > 0) selectedSets.push({ name: 'lowercase', chars });
  }
  if (numbers) {
    const chars = filterAmbiguous(NUMBER_CHARS);
    if (chars.length > 0) selectedSets.push({ name: 'numbers', chars });
  }
  if (specialCharacters) {
    const chars = filterAmbiguous(SPECIAL_CHARS);
    if (chars.length > 0) selectedSets.push({ name: 'special', chars });
  }

  if (selectedSets.length === 0) {
    throw new Error('Select at least one character type.');
  }

  const resultChars: string[] = [];

  // Guarantee at least one character from EACH selected set
  for (const set of selectedSets) {
    const charIndex = getSecureRandomInt(set.chars.length);
    resultChars.push(set.chars[charIndex]);
  }

  // Combined pool for the remainder of the password length
  const combinedPool = selectedSets.map(s => s.chars).join('');
  const remainingCount = length - resultChars.length;

  for (let i = 0; i < remainingCount; i++) {
    const charIndex = getSecureRandomInt(combinedPool.length);
    resultChars.push(combinedPool[charIndex]);
  }

  // Cryptographically shuffle to prevent guaranteed characters from being predictable in the first positions
  const shuffled = secureShuffle(resultChars);

  return shuffled.join('');
}

// Curated list of distinct memorable words for secure passphrases (Diceware style)
const PASSPHRASE_WORDLIST = [
  'anchor', 'beacon', 'breeze', 'canyon', 'castle', 'cobalt', 'cosmos', 'crater',
  'delta', 'ember', 'falcon', 'fathom', 'forest', 'fossil', 'galaxy', 'glacier',
  'granite', 'harbor', 'island', 'jasper', 'lagoon', 'matrix', 'meadow', 'meteor',
  'monarch', 'nebula', 'oasis', 'orbit', 'pebble', 'phoenix', 'planet', 'portal',
  'prism', 'quantum', 'quartz', 'radar', 'ranger', 'ravine', 'ripple', 'safari',
  'shadow', 'shield', 'sierra', 'solar', 'spark', 'summit', 'temple', 'thunder',
  'titan', 'torch', 'tundra', 'valley', 'vector', 'vortex', 'voyage', 'zenith'
];

/**
 * Generates a Diceware-style memorable passphrase
 */
export function generateSecurePassphrase(wordCount = 4, separator = '-', includeNumber = true): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = getSecureRandomInt(PASSPHRASE_WORDLIST.length);
    // Capitalize first letter
    const w = PASSPHRASE_WORDLIST[idx];
    words.push(w.charAt(0).toUpperCase() + w.slice(1));
  }

  let phrase = words.join(separator);
  if (includeNumber) {
    const num = getSecureRandomInt(900) + 100; // 3-digit random number
    phrase += `${separator}${num}`;
  }
  return phrase;
}
