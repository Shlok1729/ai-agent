import React, { useState } from 'react';
import { SummarizeResult } from '../types/agent';
import {
  Copy,
  Check,
  Clock,
  Minimize2,
  FileText,
  ListChecks,
  CheckCircle,
} from 'lucide-react';

interface SummarizeViewProps {
  result: SummarizeResult | null;
  format: string;
  onChangeFormat: (fmt: string) => void;
  length: string;
  onChangeLength: (len: string) => void;
}

const FORMATS = [
  { id: 'bullets', label: 'Key Bullets' },
  { id: 'executive', label: 'Executive Brief' },
  { id: 'tldr', label: 'TL;DR (1 Sentence)' },
  { id: 'action_items', label: 'Action Items' },
  { id: 'structured_outline', label: 'Outline' },
];

const LENGTHS = [
  { id: 'brief', label: 'Brief (~25%)' },
  { id: 'moderate', label: 'Balanced (~50%)' },
  { id: 'detailed', label: 'Detailed (~75%)' },
];

export const SummarizeView: React.FC<SummarizeViewProps> = ({
  result,
  format,
  onChangeFormat,
  length,
  onChangeLength,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `TL;DR: ${result.tldr}\n\nSUMMARY:\n${result.summary}\n\nKEY TAKEAWAYS:\n${result.keyTakeaways.map((t) => `• ${t}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Controls: Format & Length */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Format Mode
          </label>
          <div className="flex flex-wrap gap-1">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onChangeFormat(f.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  format === f.id
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Summary Depth
          </label>
          <div className="flex flex-wrap gap-1">
            {LENGTHS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onChangeLength(l.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  length === l.id
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-4 pt-1">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-violet-50/80 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50 text-center">
            <div>
              <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">Reduction</div>
              <div className="text-base font-bold text-violet-900 dark:text-violet-200">
                {result.stats.compressionRate}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">Words</div>
              <div className="text-base font-bold text-violet-900 dark:text-violet-200">
                {result.stats.summaryWords} <span className="text-xs font-normal text-violet-500">/ {result.stats.originalWords}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">Time Saved</div>
              <div className="text-base font-bold text-violet-900 dark:text-violet-200">
                {result.stats.readingTimeSavedMinutes || '1 min'}
              </div>
            </div>
          </div>

          {/* TLDR Box */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                <Minimize2 className="w-3.5 h-3.5" />
                TL;DR in One Sentence
              </span>
              <button
                onClick={handleCopy}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied All' : 'Copy All'}
              </button>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
              "{result.tldr}"
            </p>
          </div>

          {/* Core Summary Body */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Synthesized Summary
            </h5>
            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap select-text font-normal">
              {result.summary}
            </div>
          </div>

          {/* Key Takeaways */}
          {result.keyTakeaways && result.keyTakeaways.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-violet-500" />
                Key Takeaways
              </h5>
              <ul className="space-y-2">
                {result.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
