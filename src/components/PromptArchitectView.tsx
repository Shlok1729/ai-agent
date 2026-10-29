import React, { useState } from 'react';
import { PromptArchitectResult } from '../types/agent';
import {
  Copy,
  Check,
  Cpu,
  Layers,
  ShieldAlert,
  Play,
  Terminal,
  Sparkles,
} from 'lucide-react';

interface PromptArchitectViewProps {
  result: PromptArchitectResult | null;
  targetModel: string;
  onSelectModel: (m: string) => void;
  domain: string;
  onSelectDomain: (d: string) => void;
  onTestPrompt: (promptText: string) => void;
  isTestingPrompt: boolean;
  testResponse: string | null;
}

const MODELS = ['Gemini 3.8 Flash', 'Claude 3.5 Sonnet', 'GPT-4o', 'Midjourney v6', 'Code Agent'];
const DOMAINS = ['General', 'Coding & Architecture', 'Marketing & Copy', 'Executive & Business', 'Research'];

export const PromptArchitectView: React.FC<PromptArchitectViewProps> = ({
  result,
  targetModel,
  onSelectModel,
  domain,
  onSelectDomain,
  onTestPrompt,
  isTestingPrompt,
  testResponse,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            Target Model
          </label>
          <div className="flex flex-wrap gap-1">
            {MODELS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onSelectModel(m)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  targetModel === m
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Domain Focus
          </label>
          <div className="flex flex-wrap gap-1">
            {DOMAINS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onSelectDomain(d)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  domain === d
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-4 pt-1">
          {/* Header Score Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-800/90 border border-slate-700/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
                {result.promptQualityScore}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Engineered Prompt Ready</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Optimized for {targetModel} • Structured with Chain-of-Thought &amp; Guardrails
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onTestPrompt(result.optimizedPrompt)}
                disabled={isTestingPrompt}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                {isTestingPrompt ? 'Executing...' : 'Test Run Prompt'}
              </button>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Optimized Prompt Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              Engineered Prompt Text
            </h5>
            <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-pre-wrap leading-relaxed select-text overflow-x-auto">
              {result.optimizedPrompt}
            </pre>
          </div>

          {/* Test Execution Output */}
          {testResponse && (
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80">
              <h5 className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Live Test Execution Output (Gemini 3.8 Flash)
              </h5>
              <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                {testResponse}
              </div>
            </div>
          )}

          {/* Architecture Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h6 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Role &amp; Objective
              </h6>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <strong>Role:</strong> {result.architecture.role}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Task:</strong> {result.architecture.task}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h6 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                Guardrails &amp; Constraints
              </h6>
              <ul className="space-y-1">
                {result.architecture.guardrails.slice(0, 3).map((g, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1">
                    <span className="text-rose-500 mr-1">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
