# Password Strength Analyzer & Secure Password Generator

> A privacy-focused cybersecurity tool designed for real-time password strength analysis, heuristic pattern detection, and cryptographically secure password generation.

---

## 🔒 Privacy & Zero-Knowledge Guarantee

* **100% Client-Side Evaluation:** All password analysis and random generation algorithms execute entirely within your local browser.
* **Zero Network Transmission:** No entered or generated passwords ever leave your machine. No external APIs or telemetry servers are contacted.
* **No Storage Persistence:** Credentials are never cached or persisted to `localStorage`, `sessionStorage`, `IndexedDB`, cookies, or browser logs.
* **Disclaimer:** This tool is designed for educational, auditing, and defensive security evaluation. It does not provide absolute guarantees of security against advanced targeted attacks.

---

## ✨ Key Capabilities

### 1. Password Strength Analysis
* **Real-time 5-Segment Strength Meter:** Instant categorization into **Very Weak**, **Weak**, **Medium**, **Strong**, or **Very Strong**.
* **Character Composition Auditing:** Real-time visual tracking of lowercase, uppercase, numeric, and special character diversity.
* **Information Entropy Calculation:** Measures theoretical search spaces using Shannon entropy ($E = L \times \log_2(R)$) adjusted for character repetition and distribution.
* **Multi-Scenario Brute-Force Estimation:** Demonstrates theoretical crack times across online throttled services, online unthrottled endpoints, slow hash functions (Argon2/bcrypt), and high-performance multi-GPU clusters.

### 2. Heuristic Pattern Detection
* **Sequential Character Detection:** Identifies ascending and descending numeric series (`123456`, `987654`) and alphabetical sequences (`abcdef`, `zyxw`).
* **Repetition Analysis:** Detects repeated characters (`aaaaaa`, `111111`) and duplicated syllables/halves (`passpass`, `123123`).
* **Keyboard Walks:** Scans physical QWERTY keyboard rows and diagonal sequences (`qwerty`, `asdfgh`, `zxcvbn`, `1qaz`).
* **Common Leetspeak Substitutions:** Unmasks common character substitutions (`p@ssword`, `pa$$word`, `p@55w0rd`) to reveal dictionary roots.
* **Predictable Structural Formats:** Highlights classic corporate compliance habits (`Password123!`, `Summer2024!`, calendar years, and email patterns).

### 3. Local Common Password Database
* **Offline Threat List:** Embedded dataset curated from prominent breach collections (RockYou, SecLists).
* **Instant $O(1)$ Verification:** Fast set lookups and normalized comparisons to immediately flag compromised or known dictionary credentials.

### 4. Cryptographically Secure Password Generator
* **Hardware Entropy (CSPRNG):** Exclusively uses the browser's `crypto.getRandomValues()` API (never `Math.random()`).
* **Unbiased Rejection Sampling:** Completely eliminates modulo bias for mathematically uniform distribution across all selected characters.
* **Configurable Parameters:**
  * Length adjustment: 8 to 64 characters.
  * Category controls: Uppercase, Lowercase, Numbers, and Special Symbols.
  * Optional: Exclude ambiguous characters (`O, 0, I, l, 1, |`).
  * Guarantees at least one character from each selected category with Fisher-Yates shuffling.
* **Memorable Diceware Passphrases:** Multi-word passphrases with custom separators and optional numeric suffixes.
* **One-Click Hand-Off:** Directly transfer generated credentials into the analyzer for immediate structural review.

### 5. Redacted Security Analysis Report
* One-click audit report summarizing strength, entropy bits, composition breakdown, identified patterns, and dynamic recommendations.
* **Strict Privacy Redaction:** The actual password is intentionally omitted from the generated report.
* Supports **Print Report** (clean print stylesheet) and **Download (.txt)** export.

### 6. Educational Guide & Demonstrations
* Comprehensive security reference covering Multi-Factor Authentication (MFA/FIDO2), credential stuffing, passphrases, and offline GPU cracking.
* Interactive demo benchmark presets (`password123`, `Harshith@123`, `River!Moon7$Cloud#`, and randomized strings) with clear safety notices.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, TypeScript (Strict)
* **Styling:** Tailwind CSS v4, SOC-inspired cybersecurity dark interface
* **Icons:** Lucide React
* **Build System:** Vite 8
* **Cryptography:** Web Crypto API (`window.crypto.getRandomValues`)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm (v9 or higher)

### Installation
```bash
# Clone repository
git clone https://github.com/yashaswini1136/-Password-Strength-Analyzer-Secure-Password-Generator.git

# Enter project directory
cd -Password-Strength-Analyzer-Secure-Password-Generator

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📜 License & Academic Context

Developed as a cybersecurity computer science project demonstrating authentication security, heuristic evaluation, pattern recognition, and cryptographically sound credential generation.
