/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AgentType,
  GrammarResult,
  ParaphraseResult,
  SummarizeResult,
  HumanizeResult,
  PromptArchitectResult,
  AnalyzerResult,
  OcrResult,
  CopilotMessage,
  HistoryItem,
} from './types/agent';
import { SAMPLE_TEXTS } from './data/sampleData';
import { Header } from './components/Header';
import { AgentSelector } from './components/AgentSelector';
import { GrammarView } from './components/GrammarView';
import { ParaphraseView } from './components/ParaphraseView';
import { SummarizeView } from './components/SummarizeView';
import { HumanizeView } from './components/HumanizeView';
import { PromptArchitectView } from './components/PromptArchitectView';
import { AnalyzerView } from './components/AnalyzerView';
import { VisionOcrView } from './components/VisionOcrView';
import { CopilotView } from './components/CopilotView';
import { PublishToGithubModal } from './components/PublishToGithubModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  Sparkles,
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileText,
  ChevronDown,
  Layers,
} from 'lucide-react';

const MAX_CHAR_LIMIT = 8000;

export default function App() {
  const [currentAgent, setCurrentAgent] = useState<AgentType>('grammar');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Agent State
  const [grammarResult, setGrammarResult] = useState<GrammarResult | null>(null);
  const [paraphraseResult, setParaphraseResult] = useState<ParaphraseResult | null>(null);
  const [selectedTone, setSelectedTone] = useState('Standard');
  const [preserveKeywords, setPreserveKeywords] = useState<string[]>([]);

  const [summarizeResult, setSummarizeResult] = useState<SummarizeResult | null>(null);
  const [summarizeFormat, setSummarizeFormat] = useState('bullets');
  const [summarizeLength, setSummarizeLength] = useState('moderate');

  const [humanizeResult, setHumanizeResult] = useState<HumanizeResult | null>(null);
  const [selectedPersona, setSelectedPersona] = useState('Conversational & Authentic');

  const [promptResult, setPromptResult] = useState<PromptArchitectResult | null>(null);
  const [targetModel, setTargetModel] = useState('Gemini 3.8 Flash');
  const [promptDomain, setPromptDomain] = useState('General');
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  const [promptTestResponse, setPromptTestResponse] = useState<string | null>(null);

  const [analyzerResult, setAnalyzerResult] = useState<AnalyzerResult | null>(null);

  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState('image/png');

  // Co-Pilot state
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Modals & Drawers
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Text-To-Speech
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('brainboom_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // ignore
    }

    // Default sample on first load
    setInputText(SAMPLE_TEXTS.grammar.text);
  }, []);

  const saveToHistory = (agent: AgentType, title: string, input: string, output: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      agent,
      title: title.slice(0, 80),
      inputText: input,
      outputText: output,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [newItem, ...history.slice(0, 49)];
    setHistory(updated);
    try {
      localStorage.setItem('brainboom_history', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Switch agent and auto-suggest relevant sample text if empty
  const handleSelectAgent = (agent: AgentType) => {
    setCurrentAgent(agent);
    setErrorMessage(null);
    if (!inputText.trim() && SAMPLE_TEXTS[agent]?.text) {
      setInputText(SAMPLE_TEXTS[agent].text);
    }
  };

  // Load sample text
  const handleLoadSample = (key: string) => {
    if (SAMPLE_TEXTS[key]) {
      setInputText(SAMPLE_TEXTS[key].text);
      setErrorMessage(null);
    }
  };

  // Clear all
  const handleClear = () => {
    setInputText('');
    setGrammarResult(null);
    setParaphraseResult(null);
    setSummarizeResult(null);
    setHumanizeResult(null);
    setPromptResult(null);
    setAnalyzerResult(null);
    setOcrResult(null);
    setSelectedImageBase64(null);
    setPromptTestResponse(null);
    setErrorMessage(null);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Run the active agent
  const handleRunAgent = async () => {
    setErrorMessage(null);

    if (currentAgent === 'ocr') {
      if (!selectedImageBase64) {
        setErrorMessage('Please upload an image or choose one of the pre-loaded sample images.');
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch('/api/agent/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: selectedImageBase64,
            mimeType: imageMimeType,
            formatPrompt: 'Extract cleanly and format in markdown',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to extract text');
        setOcrResult(data);
        saveToHistory('ocr', `OCR Extracted (${data.documentType})`, 'Image upload', data.extractedText);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Processing failed');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!inputText.trim()) {
      setErrorMessage('Please enter or paste some text to process.');
      return;
    }

    setIsLoading(true);

    try {
      if (currentAgent === 'grammar') {
        const res = await fetch('/api/agent/grammar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Grammar analysis failed');
        setGrammarResult(data);
        saveToHistory('grammar', data.summary || 'Grammar Check', inputText, data.correctedText);
      } else if (currentAgent === 'paraphrase') {
        const res = await fetch('/api/agent/paraphrase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            tone: selectedTone,
            preserveKeywords,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Paraphrasing failed');
        setParaphraseResult(data);
        saveToHistory(
          'paraphrase',
          `Paraphrased in ${selectedTone}`,
          inputText,
          data.variations?.[0]?.text || ''
        );
      } else if (currentAgent === 'summarize') {
        const res = await fetch('/api/agent/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            format: summarizeFormat,
            length: summarizeLength,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Summarization failed');
        setSummarizeResult(data);
        saveToHistory('summarize', data.tldr || 'Summarization', inputText, data.summary);
      } else if (currentAgent === 'humanize') {
        const res = await fetch('/api/agent/humanize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            persona: selectedPersona,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Humanization failed');
        setHumanizeResult(data);
        saveToHistory(
          'humanize',
          `AI Score: ${data.initialAiProbability}% -> ${data.finalAiProbability}%`,
          inputText,
          data.humanizedText
        );
      } else if (currentAgent === 'prompt-architect') {
        const res = await fetch('/api/agent/prompt-architect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawPrompt: inputText,
            targetModel,
            goal: promptDomain,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Prompt engineering failed');
        setPromptResult(data);
        saveToHistory(
          'prompt-architect',
          `Prompt for ${targetModel}`,
          inputText,
          data.optimizedPrompt
        );
      } else if (currentAgent === 'analyze') {
        const res = await fetch('/api/agent/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Analysis failed');
        setAnalyzerResult(data);
        saveToHistory(
          'analyze',
          `Readability: ${data.fleschScore}/100 (${data.gradeLevel})`,
          inputText,
          `Dominant Tone: ${data.dominantTone}`
        );
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Test Run engineered prompt
  const handleTestPrompt = async (promptText: string) => {
    setIsTestingPrompt(true);
    setPromptTestResponse(null);
    try {
      const res = await fetch('/api/agent/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptText }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to execute prompt');
      setPromptTestResponse(data.reply);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to test prompt');
    } finally {
      setIsTestingPrompt(false);
    }
  };

  // Send message in Co-Pilot
  const handleSendCopilotMessage = async (content: string) => {
    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const nextMessages = [...copilotMessages, userMsg];
    setCopilotMessages(nextMessages);
    setIsCopilotLoading(true);

    try {
      const res = await fetch('/api/agent/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          documentContext: inputText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Copilot failed to respond');

      const botMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCopilotMessages([...nextMessages, botMsg]);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to get co-pilot response');
    } finally {
      setIsCopilotLoading(false);
    }
  };

  // Text to Speech
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Determine current primary output
    let textToSpeak = '';
    if (currentAgent === 'grammar' && grammarResult) textToSpeak = grammarResult.correctedText;
    else if (currentAgent === 'paraphrase' && paraphraseResult)
      textToSpeak = paraphraseResult.variations[0]?.text || '';
    else if (currentAgent === 'summarize' && summarizeResult)
      textToSpeak = `${summarizeResult.tldr}. ${summarizeResult.summary}`;
    else if (currentAgent === 'humanize' && humanizeResult)
      textToSpeak = humanizeResult.humanizedText;
    else if (currentAgent === 'prompt-architect' && promptResult)
      textToSpeak = promptResult.optimizedPrompt;
    else if (currentAgent === 'ocr' && ocrResult) textToSpeak = ocrResult.extractedText;

    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Pipe text from OCR to another agent
  const handleSendOcrToAgent = (
    agent: 'grammar' | 'paraphrase' | 'summarize' | 'humanize',
    text: string
  ) => {
    setInputText(text);
    setCurrentAgent(agent);
  };

  // Restore history
  const handleRestoreHistory = (item: HistoryItem) => {
    setInputText(item.inputText);
    setCurrentAgent(item.agent);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const hasOutput = Boolean(
    grammarResult ||
      paraphraseResult ||
      summarizeResult ||
      humanizeResult ||
      promptResult ||
      analyzerResult ||
      ocrResult
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Header */}
      <Header
        onOpenGithub={() => setIsGithubModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onClear={handleClear}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        hasOutput={hasOutput}
      />

      {/* Agent Selector Bar */}
      <AgentSelector currentAgent={currentAgent} onSelectAgent={handleSelectAgent} />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Co-Pilot has a dedicated full-width view */}
        {currentAgent === 'copilot' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-fuchsia-500" />
                  Working Document Context
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  The Co-Pilot reads this text directly to answer questions and execute revisions.
                </p>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or write your working article, email, or draft here..."
                  className="w-full h-72 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                  <span>{wordCount} words</span>
                  <span>{charCount} / {MAX_CHAR_LIMIT} chars</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <CopilotView
                messages={copilotMessages}
                onSendMessage={handleSendCopilotMessage}
                onClearMessages={() => setCopilotMessages([])}
                isLoading={isCopilotLoading}
                documentContext={inputText}
              />
            </div>
          </div>
        ) : (
          /* Standard 2-Column Split Workspace for other agents */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* LEFT PANE: Input & Controls */}
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                {/* Input Header & Sample Selector */}
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Input Source
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({wordCount} words • {charCount} chars)
                    </span>
                  </div>

                  {/* Preset Sample Picker */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLoadSample(currentAgent === 'prompt-architect' ? 'promptArchitect' : currentAgent)}
                      className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      Try Sample
                    </button>
                    {inputText && (
                      <button
                        type="button"
                        onClick={() => setInputText('')}
                        className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Textarea (or Vision upload if OCR) */}
                {currentAgent === 'ocr' ? (
                  <VisionOcrView
                    result={ocrResult}
                    onSendToAgent={handleSendOcrToAgent}
                    onSelectImage={(base64, mime) => {
                      setSelectedImageBase64(base64);
                      setImageMimeType(mime);
                    }}
                    selectedImageBase64={selectedImageBase64}
                  />
                ) : (
                  <div className="relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_CHAR_LIMIT) {
                          setInputText(e.target.value);
                        }
                      }}
                      placeholder={
                        currentAgent === 'prompt-architect'
                          ? 'Enter your raw idea or draft prompt here (e.g. "write an email asking for a raise")...'
                          : currentAgent === 'humanize'
                          ? 'Paste AI-generated text to analyze robotic patterns and rewrite naturally...'
                          : 'Paste or type text to process with Gemini 3.8 Flash...'
                      }
                      className="w-full h-80 text-sm leading-relaxed bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-normal"
                    />

                    {/* Progress Bar of Character Limit */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full transition-all duration-300 ${
                          charCount > MAX_CHAR_LIMIT * 0.9 ? 'bg-rose-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, (charCount / MAX_CHAR_LIMIT) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Trigger Button */}
                <div className="mt-4 flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-400 hidden sm:block">
                    Powered by Gemini 3.8 Flash • Anonymous &amp; Private
                  </div>

                  <button
                    onClick={handleRunAgent}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {currentAgent === 'grammar' && 'Fix Grammar & Polish'}
                          {currentAgent === 'paraphrase' && 'Generate 3 Paraphrases'}
                          {currentAgent === 'summarize' && 'Synthesize Summary'}
                          {currentAgent === 'humanize' && 'Humanize AI Voice'}
                          {currentAgent === 'prompt-architect' && 'Engineer Production Prompt'}
                          {currentAgent === 'analyze' && 'Run Deep Diagnostics'}
                          {currentAgent === 'ocr' && 'Extract Text via Vision'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Agent Output Display */}
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs min-h-[460px]">
                {/* Result header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Agent Output Console
                    </h3>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {isLoading ? 'Processing...' : hasOutput ? 'Ready' : 'Awaiting prompt'}
                  </span>
                </div>

                {/* Loading skeleton */}
                {isLoading && (
                  <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 animate-spin">
                      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Gemini 3.8 Flash Agent at work...
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      Evaluating syntax, style nuances, and deep linguistic patterns.
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !hasOutput && currentAgent !== 'ocr' && (
                  <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                      <Layers className="w-6 h-6 text-slate-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Ready to Transform Your Writing
                    </h4>
                    <p className="text-xs max-w-sm mt-1">
                      Choose an agent above, enter your text on the left, or click "Try Sample" to begin.
                    </p>
                  </div>
                )}

                {/* Specific Agent Results */}
                {!isLoading && (
                  <>
                    {currentAgent === 'grammar' && (
                      <GrammarView
                        result={grammarResult}
                        onApplyCorrected={(text) => setInputText(text)}
                        originalText={inputText}
                      />
                    )}

                    {currentAgent === 'paraphrase' && (
                      <ParaphraseView
                        result={paraphraseResult}
                        onUseVariation={(text) => setInputText(text)}
                        selectedTone={selectedTone}
                        onSelectTone={setSelectedTone}
                        preserveKeywords={preserveKeywords}
                        onAddKeyword={(kw) => {
                          if (!preserveKeywords.includes(kw)) {
                            setPreserveKeywords([...preserveKeywords, kw]);
                          }
                        }}
                        onRemoveKeyword={(kw) => {
                          setPreserveKeywords(preserveKeywords.filter((k) => k !== kw));
                        }}
                      />
                    )}

                    {currentAgent === 'summarize' && (
                      <SummarizeView
                        result={summarizeResult}
                        format={summarizeFormat}
                        onChangeFormat={setSummarizeFormat}
                        length={summarizeLength}
                        onChangeLength={setSummarizeLength}
                      />
                    )}

                    {currentAgent === 'humanize' && (
                      <HumanizeView
                        result={humanizeResult}
                        onApplyHumanized={(text) => setInputText(text)}
                        selectedPersona={selectedPersona}
                        onSelectPersona={setSelectedPersona}
                      />
                    )}

                    {currentAgent === 'prompt-architect' && (
                      <PromptArchitectView
                        result={promptResult}
                        targetModel={targetModel}
                        onSelectModel={setTargetModel}
                        domain={promptDomain}
                        onSelectDomain={setPromptDomain}
                        onTestPrompt={handleTestPrompt}
                        isTestingPrompt={isTestingPrompt}
                        testResponse={promptTestResponse}
                      />
                    )}

                    {currentAgent === 'analyze' && (
                      <AnalyzerView result={analyzerResult} />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Publish to GitHub Modal */}
      <PublishToGithubModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onRestore={handleRestoreHistory}
        onClearHistory={() => {
          setHistory([]);
          localStorage.removeItem('brainboom_history');
        }}
      />
    </div>
  );
}
