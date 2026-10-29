import React from 'react';
import {
  Sparkles,
  Github,
  History,
  FileCode2,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface HeaderProps {
  onOpenGithub: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onClear: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  hasOutput: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGithub,
  onOpenHistory,
  historyCount,
  onClear,
  isSpeaking,
  onToggleSpeech,
  hasOutput,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity inspired by BrainBoomingAI */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                BrainBoom <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 font-extrabold">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 rounded-full">
                Gemini 3.1 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Multi-Agent Writing &amp; Reasoning Suite • Inspired by brainboomingai
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasOutput && (
            <button
              onClick={onToggleSpeech}
              title={isSpeaking ? 'Stop vocal playback' : 'Read output aloud (Text-to-Speech)'}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 ring-2 ring-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-bounce" />
                  <span className="hidden md:inline">Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden md:inline">Listen</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClear}
            title="Clear all fields"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHistory}
            className="relative px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 text-[10px] rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Publish to GitHub Button */}
          <button
            onClick={onOpenGithub}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-indigo-600 dark:to-violet-600 text-white shadow-sm hover:shadow-md hover:opacity-95 transition-all flex items-center gap-2 border border-slate-700/20"
          >
            <Github className="w-4 h-4" />
            <span className="font-medium">Publish to GitHub</span>
          </button>
        </div>
      </div>
    </header>
  );
};
