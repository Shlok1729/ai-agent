import React from 'react';
import { AgentType } from '../types/agent';
import {
  SpellCheck,
  RefreshCw,
  FileText,
  UserCheck,
  Cpu,
  BarChart3,
  Camera,
  MessageSquare,
} from 'lucide-react';

interface AgentSelectorProps {
  currentAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
}

interface AgentItem {
  id: AgentType;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  accent: string;
}

const AGENTS: AgentItem[] = [
  {
    id: 'grammar',
    label: 'Grammar Fixer',
    tagline: 'Precision copyediting & syntax diffs',
    icon: SpellCheck,
    accent: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'paraphrase',
    label: 'Paraphraser',
    tagline: '7 tone modes & keyword locks',
    icon: RefreshCw,
    accent: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
  },
  {
    id: 'summarize',
    label: 'Summarizer',
    tagline: 'Executive briefing & TL;DR',
    icon: FileText,
    accent: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
  },
  {
    id: 'humanize',
    label: 'AI to Human',
    tagline: 'Anti-AI detector & organic rewrites',
    icon: UserCheck,
    badge: 'Popular',
    accent: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
  },
  {
    id: 'prompt-architect',
    label: 'Prompt Architect',
    tagline: 'Turns ideas into production prompts',
    icon: Cpu,
    accent: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'analyze',
    label: 'Readability & Tone',
    tagline: 'Flesch score & sentiment diagnostics',
    icon: BarChart3,
    accent: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
  },
  {
    id: 'ocr',
    label: 'Vision OCR',
    tagline: 'Extracts handwriting & docs to text',
    icon: Camera,
    badge: 'Multimodal',
    accent: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
  },
  {
    id: 'copilot',
    label: 'Writing Co-Pilot',
    tagline: 'Conversational agent & live editor',
    icon: MessageSquare,
    accent: 'text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-200 dark:border-fuchsia-800',
  },
];

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  currentAgent,
  onSelectAgent,
}) => {
  return (
    <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-0.5">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const isSelected = currentAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 border ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border-slate-300 dark:border-slate-700 font-semibold ring-1 ring-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50 border-transparent'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isSelected ? agent.accent : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{agent.label}</span>
                {agent.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      agent.badge === 'Popular'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    }`}
                  >
                    {agent.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
