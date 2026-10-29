import React, { useState, useRef } from 'react';
import { OcrResult } from '../types/agent';
import { SAMPLE_OCR_IMAGES } from '../data/sampleData';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  FileText,
  RefreshCw,
  SpellCheck,
} from 'lucide-react';

interface VisionOcrViewProps {
  result: OcrResult | null;
  onSendToAgent: (agent: 'grammar' | 'paraphrase' | 'summarize' | 'humanize', text: string) => void;
  onSelectImage: (base64: string, mimeType: string) => void;
  selectedImageBase64: string | null;
}

export const VisionOcrView: React.FC<VisionOcrViewProps> = ({
  result,
  onSendToAgent,
  onSelectImage,
  selectedImageBase64,
}) => {
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSelectImage(reader.result, file.type || 'image/png');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone & Samples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Upload Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-900/50 cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Click to upload an image or document
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Supports PNG, JPG, WebP, SVG, Screenshots
          </span>
        </div>

        {/* Built-in Sample Image Selectors */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-indigo-500" />
              Try Pre-loaded Sample Images
            </span>
            <span className="text-[11px] text-slate-400">
              Test OCR instantly without uploading files
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_OCR_IMAGES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(sample.dataUrl, 'image/svg+xml')}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800 text-left transition-all group"
              >
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  {sample.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {sample.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Image Preview Thumbnail */}
      {selectedImageBase64 && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={selectedImageBase64}
              alt="OCR Target Preview"
              className="w-16 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-indigo-500" /> Image Loaded &amp; Ready
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click "Run Vision OCR Agent" below to transcribe with Gemini 3.8 Flash
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectImage('', '')}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* OCR Results Display */}
      {result && (
        <div className="space-y-3 pt-1">
          {/* Header Bar */}
          <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-800/90 border border-slate-700/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {result.documentType}
                </span>
                <span className="text-xs text-slate-300">
                  Confidence: <strong className="text-emerald-400">{result.confidence}</strong> ({result.wordCount} words)
                </span>
              </div>
              {result.notes && (
                <p className="text-xs text-slate-400 mt-1">{result.notes}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            </div>
          </div>

          {/* Extracted Text */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Transcribed Text Output
            </h5>
            <div className="text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap select-text bg-white dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {result.extractedText}
            </div>
          </div>

          {/* Direct Route to Other Agents */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h6 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Pipe Transcribed Text Directly To Another Agent:
            </h6>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSendToAgent('paraphrase', result.extractedText)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Paraphrase Text
              </button>

              <button
                onClick={() => onSendToAgent('summarize', result.extractedText)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3 h-3" />
                Summarize Document
              </button>

              <button
                onClick={() => onSendToAgent('grammar', result.extractedText)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
              >
                <SpellCheck className="w-3 h-3" />
                Fix Grammar &amp; OCR Typo
              </button>

              <button
                onClick={() => onSendToAgent('humanize', result.extractedText)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Humanize Tone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
