import React, { useState } from 'react';
import {
  Github,
  X,
  Copy,
  Check,
  Terminal,
  Download,
  BookOpen,
  Sparkles,
  GitBranch,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface PublishToGithubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishToGithubModal: React.FC<PublishToGithubModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [repoName, setRepoName] = useState('brainboom-ai-agent');
  const [githubUser, setGithubUser] = useState('your-github-username');
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [activeTab, setActiveTab] = useState<'cli' | 'readme'>('cli');

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${githubUser}/${repoName}.git`;

  const gitCommands = `# 1. Initialize local git repository (if not already initialized)
git init

# 2. Add all project files
git add .

# 3. Create your first commit
git commit -m "feat: launch BrainBoom AI agent writing suite (inspired by brainboomingai)"

# 4. Rename branch to main
git branch -M main

# 5. Link your GitHub remote
git remote add origin ${repoUrl}

# 6. Push to your GitHub repository
git push -u origin main`;

  const readmeContent = `# 🧠 BrainBoom AI - Intelligent Multi-Agent Writing & Productivity Suite

[![Powered by Google Gemini](https://img.shields.io/badge/AI-Gemini%203.8%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Express Backend](https://img.shields.io/badge/Backend-Express%20v4-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

> An advanced, open-source AI agent writing suite inspired by **BrainBoomingAI**, built with **Google Gemini 3.8 Flash**, **Express**, and **React 19**.

---

## ✨ Features & Agents

1. **✍️ Precision Grammar & Prose Fixer**
   - Syntax, punctuation, and copyediting with real-time score rating (0-100).
   - Detailed grammatical rule breakdowns with side-by-side diff comparisons.
   - 1-click "Apply All Fixes".

2. **🔄 Adaptive Stylistic Paraphraser**
   - 7 unique tones: *Standard, Fluency, Formal & Executive, Creative, Academic, Shorten, Expand*.
   - **Keyword Lock Feature**: Specify proper nouns or keywords that must remain untouched.
   - Generates 3 distinct stylistic variants per run with vocabulary upgrades.

3. **⚡ Executive Condenser & Summarizer**
   - 5 modes: *Key Bullets, Executive Briefing, 1-Sentence TL;DR, Action Items, Outline*.
   - Compression depth selector: Brief (~25%), Balanced (~50%), Detailed (~75%).
   - Word count reduction and reading time saved metrics.

4. **👤 AI-to-Human Voice Naturalizer (Anti-AI Detector & Humanizer)**
   - Calculates synthetic AI Probability score shift (e.g. 92% AI down to 8% Human).
   - Identifies and neutralizes formulaic robotic clichés (e.g. "delve into", "tapestry", "fast-paced landscape").
   - Restores rhythmic burstiness, human warmth, and natural cadence.

5. **💡 Master Prompt Architect**
   - Transforms raw, ambiguous ideas into production-ready prompts with Persona, Objective, Strict Guardrails, and Few-Shot scaffolding.
   - Built-in live test execution engine.

6. **📊 Readability & Linguistic Diagnostics**
   - Flesch Reading Ease score, Grade Level rating, Sentiment analysis.
   - Tone breakdown (Formality, Confidence, Clarity, Engagement) and overused word detection.

7. **📷 Multimodal Vision OCR Transcriber**
   - Extracts handwriting, book excerpts, whiteboards, and receipts via Gemini 3.8 Flash multimodal vision.
   - One-click piping to Paraphrase, Summarize, or Grammar agents.

8. **💬 Conversational Writing Co-Pilot**
   - Interactive chat assistant with full document awareness.

---

## 🚀 Quickstart & Installation

### 1. Clone the repository
\`\`\`bash
git clone ${repoUrl}
cd ${repoName}
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables
Create a \`.env\` file in the root directory:
\`\`\`env
# Required: Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key-here"

# Server Port (optional, defaults to 3000)
PORT=3000
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
The application will launch at \`http://localhost:3000\`.

### 5. Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🔒 Privacy & Architecture
- **Server-Side API Security**: Gemini API calls are made strictly on the server; the API key is never exposed to the client browser.
- **Stateless & Anonymous**: User text is processed anonymously on demand with zero long-term retention.

---

## 📜 Acknowledgements
Inspired by [salsadsid/brainboomingai](https://github.com/salsadsid/brainboomingai). Built with Google Gemini 3.8 Flash.`;

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Publish to Your GitHub
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn your new AI agent suite into an open-source GitHub repository
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration inputs */}
        <div className="p-4 sm:p-5 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your GitHub Username / Org
            </label>
            <input
              type="text"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. yourname"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Repository Name
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. brainboom-ai-agent"
            />
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-2.5 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'cli'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Git Push Commands
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`pb-2.5 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'readme'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Generated README.md
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'cli' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Run these commands in your local project folder to push to GitHub:
                </p>
                <button
                  onClick={handleCopyCommands}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {copiedCommands ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCommands ? 'Copied Commands' : 'Copy All Commands'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {gitCommands}
              </pre>

              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Tip:</strong> Create a new repository on{' '}
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 underline font-semibold inline-flex items-center gap-0.5"
                  >
                    github.com/new <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  with the name <code>{repoName}</code> before running the push command!
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Full, documentation-grade README with badges and instructions:
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadReadme}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File
                  </button>
                  <button
                    onClick={handleCopyReadme}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5"
                  >
                    {copiedReadme ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedReadme ? 'Copied' : 'Copy Markdown'}
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[350px]">
                {readmeContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
