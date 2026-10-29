import React from 'react';
import { AnalyzerResult } from '../types/agent';
import {
  BarChart2,
  Clock,
  Mic,
  Smile,
  AlertCircle,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';

interface AnalyzerViewProps {
  result: AnalyzerResult | null;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-4 pt-1">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-center">
          <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
            Flesch Ease
          </div>
          <div className="text-xl font-bold text-teal-950 dark:text-teal-100 my-0.5">
            {result.fleschScore} <span className="text-xs font-normal text-teal-600">/ 100</span>
          </div>
          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
            {result.gradeLevel}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Words &amp; Chars
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 my-0.5">
            {result.wordCount}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            {result.charCount} characters
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Reading Time
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 my-0.5">
            ~{result.readingTimeMinutes} min
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Silent reading (200 wpm)
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <Mic className="w-3 h-3" />
            Speaking Time
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 my-0.5">
            ~{result.speakingTimeMinutes} min
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Keynote speech (130 wpm)
          </div>
        </div>
      </div>

      {/* Tone & Sentiment Overview */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Linguistic Archetype &amp; Sentiment
            </h5>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {result.dominantTone}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Sentiment: {result.sentiment}
            </span>
          </div>
        </div>

        {/* Tone Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>Formality</span>
              <span className="font-semibold">{result.toneBreakdown.formality}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${result.toneBreakdown.formality}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>Confidence</span>
              <span className="font-semibold">{result.toneBreakdown.confidence}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-500 h-2 rounded-full"
                style={{ width: `${result.toneBreakdown.confidence}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>Clarity</span>
              <span className="font-semibold">{result.toneBreakdown.clarity}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${result.toneBreakdown.clarity}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>Engagement</span>
              <span className="font-semibold">{result.toneBreakdown.engagement}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-pink-500 h-2 rounded-full"
                style={{ width: `${result.toneBreakdown.engagement}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overused Words & Actionable Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {result.overusedWords && result.overusedWords.length > 0 && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h6 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Repetitive / Overused Words
            </h6>
            <div className="flex flex-wrap gap-1.5">
              {result.overusedWords.map((w, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h6 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-teal-500" />
            Top Recommendations
          </h6>
          <ul className="space-y-1.5">
            {result.actionableRecommendations.map((rec, i) => (
              <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
