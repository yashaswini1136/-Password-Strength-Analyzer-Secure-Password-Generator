export type StrengthLevel = 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';

export type PatternSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface DetectedPattern {
  id: string;
  name: string;
  type: 'sequential' | 'repeated' | 'keyboard' | 'substitution' | 'dictionary' | 'date' | 'structure' | 'username';
  description: string;
  detail: string;
  severity: PatternSeverity;
}

export interface CrackTimeEstimates {
  onlineThrottled: string;     // 100 attempts / hour (rate limited web forms)
  onlineUnthrottled: string;   // 100 attempts / second (unrestricted API/login)
  offlineSlowHash: string;     // 10,000 attempts / sec (bcrypt, Argon2, scrypt)
  offlineFastHash: string;     // 100 billion / sec (modern multi-GPU cluster SHA-256 / MD5 / NTLM)
}

export interface PasswordAnalysisResult {
  score: number; // 0 - 100
  strengthLevel: StrengthLevel;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialCharacters: boolean;
  uppercaseCount: number;
  lowercaseCount: number;
  numberCount: number;
  specialCount: number;
  uniqueCharCount: number;
  detectedPatterns: DetectedPattern[];
  isCommonPassword: boolean;
  commonPasswordMatch?: string;
  commonPasswordRank?: number;
  recommendations: string[];
  entropyBits: number;
  charSetSize: number;
  crackTimes: CrackTimeEstimates;
}

export interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  specialCharacters: boolean;
  excludeAmbiguous: boolean;
}

export interface SecurityReportData {
  generatedAt: string;
  score: number;
  strengthLevel: StrengthLevel;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialCharacters: boolean;
  uniqueChars: number;
  detectedPatterns: { name: string; description: string; severity: PatternSeverity }[];
  isCommonPassword: boolean;
  commonPasswordNote?: string;
  recommendations: string[];
  entropyBits: number;
  crackTimeOfflineGPU: string;
}
