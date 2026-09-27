/**
 * Common Passwords Dataset
 * Curated from top leaked passwords (RockYou, SecLists, splashdata, HaveIBeenPwned common top lists).
 * Used purely for local, client-side educational security evaluation.
 * Passwords are NEVER sent to any remote server or API.
 */

export const TOP_COMMON_PASSWORDS: string[] = [
  "123456", "password", "123456789", "12345678", "12345", "111111", "1234567", "sunshine",
  "qwerty", "iloveyou", "princess", "admin", "welcome", "666666", "123123", "monkey",
  "football", "charlie", "aa123456", "donald", "shadow", "master", "superman", "killer",
  "trustno1", "jordan", "jennifer", "zxcvbn", "asdfgh", "hunter2", "letmein", "dragon",
  "starwars", "batman", "test", "pass123", "root", "login", "guest", "default", "system",
  "oracle", "cisco", "pass@word", "pass1234", "password1", "password123", "p@ssword",
  "pa$$word", "p@ssw0rd", "welcome1", "welcome123", "admin123", "admin@123", "administrator",
  "manager", "server", "security", "secret", "computer", "internet", "access", "database",
  "alex@demo456", "user123", "qwertyuiop", "asdfghjkl", "zxcvbnm", "000000", "222222",
  "333333", "444444", "555555", "777777", "888888", "999999", "1234321", "654321",
  "987654321", "abcdef", "abcdefg", "abcdefgh", "abcdef123", "test123", "test1234",
  "testing", "temp123", "temporary", "spring2024", "summer2024", "fall2024", "winter2024",
  "spring2025", "summer2025", "fall2025", "winter2025", "spring2026", "summer2026",
  "hello123", "helloworld", "iloveu", "forever", "sweetheart", "honey", "cookie",
  "coffee", "chocolate", "soccer", "baseball", "basketball", "hockey", "chelsea",
  "arsenal", "liverpool", "barcelona", "realmadrid", "manchester", "metallica", "nirvana",
  "blink182", "eminem", "pokemon", "matrix", "avatar", "avengers", "ironman", "spider",
  "spiderman", "gandalf", "hacker", "pentest", "kali", "cyber", "cybersecurity",
  "keyboard", "freedom", "america", "london", "paris", "tokyo", "newyork", "canada",
  "success", "millionaire", "billionaire", "money", "cash", "wealth", "winner",
  "champion", "lucky", "luckyme", "diamond", "gold", "silver", "platinum", "titanium",
  "galaxy", "universe", "cosmos", "starlight", "moonlight", "sunrise", "sunset",
  "rainbow", "butterfly", "whisper", "destiny", "harmony", "serenity", "infinity",
  "matrix123", "hacker123", "god123", "angel", "blessed", "jesus", "christ",
  "genesis", "november", "december", "january", "february", "march", "april", "may",
  "june", "july", "august", "september", "october", "monday", "friday", "sunday",
  "pass12345", "123qwe", "qwe123", "1q2w3e", "1q2w3e4r", "zaq12wsx", "qazwsxedc",
  "wsxedc", "rfvujm", "plmko", "0123456789", "9876543210", "qwerty123", "qwertz",
  "azerty", "drowssap", "passw0rd", "p@55w0rd", "p4ssw0rd", "p@ssw0rd1", "hunter1",
  "qwerty1", "adminadmin", "testtest", "useruser", "guest123", "service123",
  "changeme", "newpassword", "reset123", "firstpass", "temppass", "mypassword"
];

// Quick lookup set
export const COMMON_SET = new Set(TOP_COMMON_PASSWORDS.map(p => p.toLowerCase()));

// Common leetspeak translation table
const LEET_MAP: Record<string, string> = {
  '@': 'a',
  '4': 'a',
  '8': 'b',
  '(': 'c',
  '3': 'e',
  '9': 'g',
  '#': 'h',
  '!': 'i',
  '1': 'i',
  '|': 'i',
  '0': 'o',
  '$': 's',
  '5': 's',
  '7': 't',
  '+': 't',
  '2': 'z',
  '%': 'x'
};

/**
 * Normalizes a password by stripping whitespace, converting to lowercase,
 * and translating common leetspeak substitutions to standard alphabets.
 */
export function normalizeLeetspeak(input: string): string {
  const lower = input.toLowerCase().trim();
  let normalized = '';
  for (const char of lower) {
    normalized += LEET_MAP[char] || char;
  }
  return normalized;
}

export interface CommonPasswordCheckResult {
  isCommon: boolean;
  isExactMatch: boolean;
  isDerivedMatch: boolean;
  matchedWord?: string;
  rank?: number;
  message?: string;
}

/**
 * Checks if a given password matches or closely resembles a known common password.
 * Analysis is 100% browser-local.
 */
export function checkCommonPassword(password: string): CommonPasswordCheckResult {
  if (!password || password.trim().length === 0) {
    return { isCommon: false, isExactMatch: false, isDerivedMatch: false };
  }

  const cleanInput = password.toLowerCase().trim();

  // 1. Exact match against common dictionary using fast set lookup
  if (COMMON_SET.has(cleanInput)) {
    const exactIndex = TOP_COMMON_PASSWORDS.indexOf(cleanInput);
    return {
      isCommon: true,
      isExactMatch: true,
      isDerivedMatch: false,
      matchedWord: cleanInput,
      rank: exactIndex !== -1 ? exactIndex + 1 : 1,
      message: `Direct match with #${exactIndex !== -1 ? exactIndex + 1 : 1} most common leaked password.`
    };
  }

  // 2. Leetspeak normalized match (e.g. p@ssw0rd -> password)
  const normalized = normalizeLeetspeak(password);
  if (COMMON_SET.has(normalized)) {
    const normalizedIndex = TOP_COMMON_PASSWORDS.indexOf(normalized);
    return {
      isCommon: true,
      isExactMatch: false,
      isDerivedMatch: true,
      matchedWord: TOP_COMMON_PASSWORDS[normalizedIndex],
      rank: normalizedIndex + 1,
      message: `Matches common password "${TOP_COMMON_PASSWORDS[normalizedIndex]}" via leetspeak/character substitution.`
    };
  }

  // 3. Substring match for dangerous root words (e.g. "password123!", "mysecretadmin2024")
  const dangerousRoots = [
    "password", "admin", "welcome", "qwerty", "123456", "iloveyou", "master",
    "dragon", "superman", "letmein", "changeme", "default", "system", "root",
    "shadow", "charlie", "monkey", "football", "login", "hunter"
  ];

  for (const root of dangerousRoots) {
    if (cleanInput.includes(root) || normalized.includes(root)) {
      return {
        isCommon: true,
        isExactMatch: false,
        isDerivedMatch: true,
        matchedWord: root,
        message: `Contains dangerous common password root "${root}". Attackers prioritize this with dictionary rule-engines.`
      };
    }
  }

  return { isCommon: false, isExactMatch: false, isDerivedMatch: false };
}
