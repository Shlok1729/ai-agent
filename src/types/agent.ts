export type AgentType =
  | 'grammar'
  | 'paraphrase'
  | 'summarize'
  | 'humanize'
  | 'prompt-architect'
  | 'analyze'
  | 'ocr'
  | 'copilot';

export interface CorrectionItem {
  original: string;
  replacement: string;
  category: string;
  explanation: string;
}

export interface GrammarResult {
  score: number;
  summary: string;
  correctedText: string;
  correctionsCount: number;
  corrections: CorrectionItem[];
}

export interface ParaphraseVariation {
  title: string;
  text: string;
  highlights: string;
}

export interface ParaphraseResult {
  toneApplied: string;
  variations: ParaphraseVariation[];
  vocabularyEnhancements?: { from: string; to: string; context?: string }[];
}

export interface SummarizeResult {
  tldr: string;
  summary: string;
  keyTakeaways: string[];
  actionItems?: string[];
  stats: {
    originalWords: number;
    summaryWords: number;
    compressionRate: string;
    readingTimeSavedMinutes?: string;
  };
}

export interface HumanizeResult {
  initialAiProbability: number;
  finalAiProbability: number;
  roboticFlagsDetected: string[];
  humanizedText: string;
  naturalCadenceTechniques: string[];
}

export interface PromptArchitectResult {
  optimizedPrompt: string;
  architecture: {
    role: string;
    task: string;
    constraints: string[];
    guardrails: string[];
    outputFormat: string;
  };
  promptQualityScore: number;
  recommendedTemperature?: string;
  testInputExample?: string;
}

export interface AnalyzerResult {
  fleschScore: number;
  gradeLevel: string;
  sentiment: string;
  dominantTone: string;
  toneBreakdown: {
    formality: number;
    confidence: number;
    clarity: number;
    engagement: number;
  };
  overusedWords: string[];
  actionableRecommendations: string[];
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export interface OcrResult {
  documentType: string;
  extractedText: string;
  confidence: string;
  wordCount: number;
  notes?: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  agent: AgentType;
  title: string;
  inputText: string;
  outputText: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
