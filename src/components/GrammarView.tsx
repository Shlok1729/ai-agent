import React, { useState } from 'react';
import { GrammarResult } from '../types/agent';
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Layers,
  Wand2,
} from 'lucide-react';

interface GrammarViewProps {
  result: GrammarResult | null;
  onApplyCorrected: (text: string) => void;
  originalText: string;
}

export const GrammarView: React.FC<GrammarViewProps> = ({
  result,
  onApplyCorrected,
  originalText,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'corrected' | 'breakdown' | 'diff'>('corrected');

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.correctedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Quality Score */}
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-800/90 border border-slate-700/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {result.score}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-slate-100">Quality Score</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                {result.correctionsCount} {result.correctionsCount === 1 ? 'Correction' : 'Corrections'} Detected
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{result.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onApplyCorrected(result.correctedText)}
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Apply All Fixes
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

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('corrected')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'corrected'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Polished Text
        </button>
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'breakdown'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Specific Corrections ({result.corrections.length})
        </button>
      </div>

      {/* Tab 1: Corrected Clean Text */}
      {activeTab === 'corrected' && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-normal select-text whitespace-pre-wrap">
          {result.correctedText}
        </div>
      )}

      {/* Tab 2: Corrections Breakdown */}
      {activeTab === 'breakdown' && (
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {result.corrections.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No errors detected! Your text is pristine.
            </div>
          ) : (
            result.corrections.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400">Fix #{idx + 1}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs my-1 flex-wrap">
                  <span className="diff-removed">{item.original || '(missing)'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="diff-added">{item.replacement}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-2 leading-relaxed">
                  💡 {item.explanation}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
