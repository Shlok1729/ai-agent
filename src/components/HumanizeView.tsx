import React, { useState } from 'react';
import { HumanizeResult } from '../types/agent';
import {
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  User,
  ArrowRight,
  Wand2,
} from 'lucide-react';

interface HumanizeViewProps {
  result: HumanizeResult | null;
  onApplyHumanized: (text: string) => void;
  selectedPersona: string;
  onSelectPersona: (persona: string) => void;
}

const PERSONAS = [
  'Conversational & Authentic',
  'Thought Leader / Founder',
  'Direct & Punchy',
  'Academic but Human',
  'Casual Storyteller',
];

export const HumanizeView: React.FC<HumanizeViewProps> = ({
  result,
  onApplyHumanized,
  selectedPersona,
  onSelectPersona,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.humanizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Persona Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-rose-500" />
          Target Voice Persona
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PERSONAS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSelectPersona(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPersona === p
                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Result Metrics */}
      {result && (
        <div className="space-y-4 pt-1">
          {/* Comparison Probability Gauge */}
          <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-800/90 border border-slate-700/60 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  AI Probability Shift
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-400 font-bold text-xl">
                      {result.initialAiProbability}%
                    </span>
                    <span className="text-xs text-slate-400">(Robotic AI)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold text-xl">
                      {result.finalAiProbability}%
                    </span>
                    <span className="text-xs text-emerald-300 font-medium">(Human Voice)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onApplyHumanized(result.humanizedText)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Use Humanized Text
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

            {/* Visual Gauge Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-2 transition-all duration-700"
                style={{ width: `${100 - result.finalAiProbability}%` }}
                title="Human authenticity"
              />
              <div
                className="bg-rose-500 h-2 transition-all duration-700"
                style={{ width: `${result.finalAiProbability}%` }}
                title="Remaining AI probability"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>100% Authentic Human Cadence</span>
              <span>Synthetic Clichés</span>
            </div>
          </div>

          {/* Robotic Clichés Detected */}
          {result.roboticFlagsDetected && result.roboticFlagsDetected.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
              <h5 className="text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Robotic Flags Detected &amp; Neutralized
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {result.roboticFlagsDetected.map((flag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 font-medium"
                  >
                    "{flag}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Humanized Output */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Humanized Prose ({selectedPersona})
            </h5>
            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap select-text font-normal">
              {result.humanizedText}
            </div>
          </div>

          {/* Natural Cadence Techniques */}
          {result.naturalCadenceTechniques && result.naturalCadenceTechniques.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Techniques Applied for Natural Flow
              </h5>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {result.naturalCadenceTechniques.map((tech, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{tech}</span>
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
