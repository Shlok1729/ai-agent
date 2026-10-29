import React, { useState, useRef, useEffect } from 'react';
import { CopilotMessage } from '../types/agent';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Copy,
  Check,
  FileCode,
} from 'lucide-react';

interface CopilotViewProps {
  messages: CopilotMessage[];
  onSendMessage: (content: string) => void;
  onClearMessages: () => void;
  isLoading: boolean;
  documentContext: string;
}

const QUICK_CHIPS = [
  'Make it more punchy & confident',
  'Improve academic citations & style',
  'Translate into Spanish & French',
  'Highlight logical flaws / critiques',
  'Convert into an executive memo',
];

export const CopilotView: React.FC<CopilotViewProps> = ({
  messages,
  onSendMessage,
  onClearMessages,
  isLoading,
  documentContext,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[600px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fuchsia-600 to-indigo-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
              BrainBoom Writing Co-Pilot
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {documentContext ? 'Active Document Context Attached' : 'Ask anything, draft ideas, or refine text'}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearMessages}
            title="Clear Chat History"
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400">
            <Sparkles className="w-8 h-8 text-fuchsia-500 mb-2 animate-bounce" />
            <h6 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              How can I assist your writing today?
            </h6>
            <p className="text-xs max-w-sm mt-1">
              Ask for creative angles, tone transformations, counter-arguments, or click a quick suggestion below:
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {QUICK_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(chip)}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40 text-slate-700 dark:text-slate-300 hover:text-fuchsia-600 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-2xs border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <div className="whitespace-pre-wrap select-text">{m.content}</div>
                {m.role === 'assistant' && (
                  <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:text-fuchsia-500 flex items-center gap-1"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600 flex items-center justify-center animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping" />
              <span>BrainBoom is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or instruction for the AI Agent..."
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white disabled:opacity-50 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
