import React, { useState } from 'react';
import { ParaphraseResult } from '../types/agent';
import {
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  BookOpen,
  ArrowUpRight,
  Wand2,
} from 'lucide-react';

interface ParaphraseViewProps {
  result: ParaphraseResult | null;
  onUseVariation: (text: string) => void;
  selectedTone: string;
  onSelectTone: (tone: string) => void;
  preserveKeywords: string[];
  onAddKeyword: (kw: string) => void;
  onRemoveKeyword: (kw: string) => void;
}

const TONES = [
  'Standard',
  'Fluency',
  'Formal & Executive',
  'Creative & Engaging',
  'Academic',
  'Concise & Short',
  'Expanded & Detailed',
];

export const ParaphraseView: React.FC<ParaphraseViewProps> = ({
  result,
  onUseVariation,
  selectedTone,
  onSelectTone,
  preserveKeywords,
  onAddKeyword,
  onRemoveKeyword,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [keywordInput, setKeywordInput] = useState('');

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      onAddKeyword(keywordInput.trim());
      setKeywordInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Tone Mode Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
          Paraphrase Style &amp; Tone
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TONES.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => onSelectTone(tone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTone === tone
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      {/* Keyword Lock Bar */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            Lock Key Words (Never change these)
          </label>
          <span className="text-[11px] text-slate-400">Press Enter to add</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {preserveKeywords.map((kw, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {kw}
              <button
                type="button"
                onClick={() => onRemoveKeyword(kw)}
                className="hover:text-red-500 ml-0.5 text-xs font-bold"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            placeholder="e.g. BrainBoom, ROI, P95"
            className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              3 Tailored Variations ({result.toneApplied})
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {result.variations.map((v, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {v.title}
                    </h5>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUseVariation(v.text)}
                      title="Set as working input"
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      Use
                    </button>
                    <button
                      onClick={() => handleCopy(v.text, idx)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                  {v.text}
                </p>

                {v.highlights && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{v.highlights}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vocabulary Enhancements */}
          {result.vocabularyEnhancements && result.vocabularyEnhancements.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Vocabulary Upgrades
              </h5>
              <div className="flex flex-wrap gap-2">
                {result.vocabularyEnhancements.map((enh, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <span className="line-through text-slate-400">{enh.from}</span>
                    <ArrowRight className="w-3 h-3 text-blue-500" />
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{enh.to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
