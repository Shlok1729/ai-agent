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
  Key,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface PublishToGithubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishToGithubModal: React.FC<PublishToGithubModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [repoName, setRepoName] = useState('ai-agent');
  const [githubUser, setGithubUser] = useState('Shlok1729');
  const [patToken, setPatToken] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{
    success: boolean;
    message: string;
    output?: string;
  } | null>(null);

  const [copiedCommands, setCopiedCommands] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'cli' | 'readme'>('direct');

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${githubUser}/${repoName}.git`;

  const gitCommands = `# 1. Link remote origin (already configured in workspace)
git remote set-url origin ${repoUrl} || git remote add origin ${repoUrl}

# 2. Push to GitHub main branch
git push -u origin main`;

  const handleDirectPush = async () => {
    if (!patToken.trim()) return;
    setIsPushing(true);
    setPushStatus(null);

    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: patToken.trim(),
          username: githubUser.trim(),
          repo: repoName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to push to GitHub.');
      }
      setPushStatus({
        success: true,
        message: data.message,
        output: data.output,
      });
    } catch (err: unknown) {
      setPushStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown push failure',
      });
    } finally {
      setIsPushing(false);
    }
  };

  const readmeContent = `# 🧠 BrainBoom AI - Intelligent Multi-Agent Writing & Productivity Suite

[![Powered by Google Gemini](https://img.shields.io/badge/AI-Gemini%203.1%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Express Backend](https://img.shields.io/badge/Backend-Express%20v4-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

> An advanced, open-source AI agent writing suite inspired by **BrainBoomingAI**, built with **Google Gemini**, **Express**, and **React 19**.

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
   - Calculates synthetic AI Probability score shift (e.g. 98% AI down to 8% Human).
   - Identifies and neutralizes formulaic robotic clichés (e.g. "delve into", "tapestry", "fast-paced landscape").
   - Restores rhythmic burstiness, human warmth, and natural cadence.

5. **💡 Master Prompt Architect**
   - Transforms raw, ambiguous ideas into production-ready prompts with Persona, Objective, Strict Guardrails, and Few-Shot scaffolding.
   - Built-in live test execution engine.

6. **📊 Readability & Linguistic Diagnostics**
   - Flesch Reading Ease score, Grade Level rating, Sentiment analysis.
   - Tone breakdown (Formality, Confidence, Clarity, Engagement) and overused word detection.

7. **📷 Multimodal Vision OCR Transcriber**
   - Extracts handwriting, book excerpts, whiteboards, and receipts via Gemini vision.
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
Inspired by [salsadsid/brainboomingai](https://github.com/salsadsid/brainboomingai). Built with Google Gemini.`;

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
                Publish to GitHub Repository
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target: <a href={`https://github.com/${githubUser}/${repoName}`} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">{githubUser}/{repoName}</a>
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
              GitHub Username / Org
            </label>
            <input
              type="text"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Shlok1729"
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
              placeholder="e.g. ai-agent"
            />
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'direct'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            1-Click Push via Token
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-2.5 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'cli'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Terminal Commands
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
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-indigo-500" />
                    Enter GitHub Personal Access Token (PAT)
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=brainboom-ai-agent-push"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    Generate token on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Because GitHub disabled password authentication for Git, GitHub requires a Personal Access Token with <code>repo</code> permissions to push code.
                </p>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={patToken}
                    onChange={(e) => setPatToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleDirectPush}
                    disabled={isPushing || !patToken.trim()}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
                  >
                    {isPushing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Pushing...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Push to GitHub</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              {pushStatus && (
                <div
                  className={`p-4 rounded-xl border text-xs ${
                    pushStatus.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {pushStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span>{pushStatus.message}</span>
                  </div>
                  {pushStatus.output && (
                    <pre className="mt-2 p-2.5 rounded-lg bg-black/5 dark:bg-black/30 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
                      {pushStatus.output}
                    </pre>
                  )}
                  {pushStatus.success && (
                    <div className="mt-3">
                      <a
                        href={`https://github.com/${githubUser}/${repoName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Open Repository on GitHub <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cli' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Or run these commands from your local machine to push:
                </p>
                <button
                  onClick={handleCopyCommands}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {copiedCommands ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCommands ? 'Copied Commands' : 'Copy Commands'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {gitCommands}
              </pre>
            </div>
          )}

          {activeTab === 'readme' && (
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
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Repository URL: https://github.com/{githubUser}/{repoName}
          </span>
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
