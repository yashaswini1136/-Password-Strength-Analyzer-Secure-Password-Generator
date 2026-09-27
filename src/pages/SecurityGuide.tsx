import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Key, 
  Lock, 
  Cpu, 
  RefreshCcw, 
  Layers, 
  FileWarning, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Search
} from 'lucide-react';

export const SecurityGuidePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('length');

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const guideSections = [
    {
      id: 'strong',
      title: 'What makes a password strong?',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      tag: 'Core Concept',
      content: `A truly strong password is characterized by high mathematical entropy and unpredictability. It combines sufficient length (minimum 12–16+ characters), diverse character spaces (uppercase, lowercase, numbers, and symbols), and complete freedom from human cognitive habits such as names, dates, dictionary words, and keyboard walking patterns. Password strength is not merely about having an exclamation mark at the end; it is about forcing an adversary into an astronomical search space that cannot be reduced with wordlists or automated pattern rules.`
    },
    {
      id: 'length',
      title: 'Recommended password length',
      icon: <Key className="w-5 h-5 text-blue-400" />,
      tag: 'Entropy Rule #1',
      content: `In modern cryptography, length is the most significant contributor to password strength. Each character added exponentially expands the brute-force search space (Total Combinations = R^L, where R is character pool size and L is length).
      
      • 8 characters: Cracked in minutes to hours using modern multi-GPU hashcat rigs.
      • 12 characters: Minimum threshold for standard accounts when complexity rules are met.
      • 16–20 characters: Recommended standard for primary email, financial portals, and master vault passwords.
      • 24–64 characters: Fortified protection for root servers, private cryptographic keys, and SSH credentials.`
    },
    {
      id: 'uniqueness',
      title: 'Why password uniqueness matters',
      icon: <RefreshCcw className="w-5 h-5 text-purple-400" />,
      tag: 'Defensive Strategy',
      content: `Every account you own must have a strictly unique password. If you use the same password on fifty different websites, you are effectively only as secure as the weakest, most poorly maintained website among them. When a minor forum or ecommerce store experiences a database leak, malicious actors immediately test those stolen credentials against Google, Apple, Microsoft, banking portals, and work accounts.`
    },
    {
      id: 'common-danger',
      title: 'Why common passwords are dangerous',
      icon: <FileWarning className="w-5 h-5 text-rose-400" />,
      tag: 'Breach Analysis',
      content: `Billions of compromised passwords from historical breaches (such as RockYou, LinkedIn, Yahoo, and Collection #1) are compiled into sorted wordlists used by penetration testers and cybercriminals alike. Attackers do not start with random character guessing. They first try the top 100,000 most common passwords, followed by rule-based permutations (e.g. capitalizing first letters or appending '123!'). If your password exists in a common list, it is cracked in less than a millisecond regardless of what symbols you use.`
    },
    {
      id: 'managers',
      title: 'Password managers & Zero-Knowledge architecture',
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      tag: 'Tooling',
      content: `Human memory is mathematically incapable of remembering dozens of distinct 20-character pseudo-random passwords. Password managers solve this by storing all credentials in an encrypted vault protected by modern symmetric encryption (such as AES-256 or ChaCha20) derived from a single strong master password using slow key-derivation functions (Argon2id, PBKDF2 with 600,000+ iterations). Reputable options include Bitwarden, 1Password, and open-source offline managers like KeePassXC.`
    },
    {
      id: 'mfa',
      title: 'Multi-Factor Authentication (MFA / 2FA)',
      icon: <Fingerprint className="w-5 h-5 text-indigo-400" />,
      tag: 'Defense in Depth',
      content: `MFA ensures that even if an attacker discovers your password, they cannot authenticate without a secondary factor. The hierarchy of MFA security:
      
      1. Hardware Security Keys & FIDO2 / Passkeys: Phishing-resistant asymmetric cryptography (YubiKey, Touch ID, Windows Hello).
      2. Authenticator Apps (TOTP): Time-based one-time codes generated on your smartphone (Aegis, Ente Auth, Google Authenticator).
      3. SMS / Voice 2FA: Better than nothing, but vulnerable to SIM-swapping and cellular interception.`
    },
    {
      id: 'reuse-stuffing',
      title: 'Password reuse & Credential Stuffing',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      tag: 'Active Threat',
      content: `Credential stuffing is an automated attack where bots attempt millions of username/password pairs scraped from previous data breaches against various online services. Because up to 65% of internet users reuse passwords, automated bots achieve massive success rates. Guarding against credential stuffing requires account uniqueness and proactive breach monitoring (e.g. HaveIBeenPwned).`
    },
    {
      id: 'passphrases',
      title: 'Passphrases vs. Complex random passwords',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      tag: 'Diceware Concept',
      content: `A passphrase consists of multiple randomly selected, memorable words (e.g. "correct-horse-battery-staple" or "Falcon-Summit-Cosmos-849"). Because words are selected from a large dictionary (typically 7,776 words in Diceware), 4 to 6 random words provide 50 to 75+ bits of entropy. Passphrases are significantly easier for humans to type and remember than random symbol strings while retaining exceptional brute-force resistance.`
    },
    {
      id: 'brute-force',
      title: 'Brute-force attacks & GPU cracking speeds',
      icon: <Cpu className="w-5 h-5 text-rose-400" />,
      tag: 'Threat Mechanism',
      content: `Brute-force involves systematically checking all possible combinations of characters. While online websites throttle failed login attempts after 5 to 10 tries, offline attacks happen when an attacker acquires a leaked password hash. High-end modern GPU clusters (e.g., eight NVIDIA RTX 4090s) can calculate over 100 billion fast hashes (NTLM or MD5) per second. Only high entropy and modern memory-hard hashing algorithms (Argon2, bcrypt) prevent offline cracking.`
    },
    {
      id: 'dictionary-rainbow',
      title: 'Dictionary attacks & Rainbow tables',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      tag: 'Cryptanalysis',
      content: `• Dictionary Attacks: Rather than attempting every possible ASCII string, attackers test words from human languages, names, places, and leaked database dictionaries.
      
      • Rainbow Tables: Pre-computed lookup tables of hashes that allow attackers to reverse unsalted password hashes almost instantly. Modern systems defend against rainbow tables by applying cryptographic **salts** (random unique byte sequences appended to each password before hashing), making pre-computed tables useless.`
    }
  ];

  const filtered = guideSections.filter(
    s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cybersecurity Knowledge Base & Principles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Authentication Security Guide
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Essential concepts in authentication security, password hygiene, threat modeling, and defensive engineering. Designed for students, security professionals, and conscious users.
          </p>
        </div>

        {/* Quick Search */}
        <div className="mt-6 relative max-w-md">
          <input
            type="text"
            placeholder="Search topics (e.g. brute-force, passphrases, MFA)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Guide Cards Accordion / List */}
      <div className="space-y-4">
        {filtered.map((section) => {
          const isExpanded = expandedSection === section.id || searchTerm.length > 0;
          return (
            <div
              key={section.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-slate-900/80 border-slate-700 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {section.tag}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      {section.title}
                    </h3>
                  </div>
                </div>

                <div className="text-slate-400 p-1 rounded-lg hover:bg-slate-800">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 space-y-3 whitespace-pre-line">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            No matching security topics found for "{searchTerm}".
          </div>
        )}
      </div>

      {/* Checklist Card: The 5 Golden Rules of Password Security */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/30 space-y-4 cyber-glow-emerald">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white font-display">
            The 5 Golden Rules of Enterprise Password Hygiene
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-slate-200 font-bold block mb-0.5">1. Never Reuse Credentials</span>
              <span className="text-slate-400">Every single digital service must have an independent, distinct password.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-slate-200 font-bold block mb-0.5">2. Prioritize Length over Complexity</span>
              <span className="text-slate-400">A 20-character passphrase beats an 8-character random string by factors of billions.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-slate-200 font-bold block mb-0.5">3. Enforce MFA Everywhere</span>
              <span className="text-slate-400">Enable FIDO2 hardware keys or authenticator apps (TOTP) across all critical accounts.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-slate-200 font-bold block mb-0.5">4. Deploy a Password Manager</span>
              <span className="text-slate-400">Let high-entropy CSPRNG algorithms generate and store passwords you never have to memorize.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
