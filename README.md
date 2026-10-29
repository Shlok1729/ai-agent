# 🧠 BrainBoom AI - Intelligent Multi-Agent Writing & Productivity Suite

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
```bash
git clone https://github.com/Shlok1729/ai-agent.git
cd ai-agent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Required: Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key-here"

# Server Port (optional, defaults to 3000)
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Privacy & Architecture
- **Server-Side API Security**: Gemini API calls are made strictly on the server; the API key is never exposed to the client browser.
- **Stateless & Anonymous**: User text is processed anonymously on demand with zero long-term retention.

---

## 📜 Acknowledgements
Inspired by [salsadsid/brainboomingai](https://github.com/salsadsid/brainboomingai). Built with Google Gemini 3.8 Flash.
