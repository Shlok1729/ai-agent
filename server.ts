import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Init Google GenAI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.1-flash-lite';

// Helper for error responses
function handleGenAiError(res: Response, error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  const errMsg = error instanceof Error ? error.message : String(error);
  if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('PERMISSION_DENIED') || errMsg.includes('403')) {
    return res.status(403).json({
      error: 'Invalid or missing Gemini API Key. Please verify your GEMINI_API_KEY in Settings > Secrets.',
    });
  }
  if (errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('429')) {
    return res.status(429).json({
      error: 'Rate limit or resource quota reached. Please retry in a few moments.',
    });
  }
  return res.status(500).json({
    error: `AI Processing failed: ${errMsg}`,
  });
}

// 1. Health Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    model: MODEL_NAME,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 2. Grammar & Style Perfection Agent
app.post('/api/agent/grammar', async (req: Request, res: Response) => {
  try {
    const { text, strictness = 'thorough' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `You are an elite Grammar & Prose Perfectionist Agent. Analyze the following text with meticulous linguistic precision.
Strictness: ${strictness}

Text to review:
"""
${text}
"""

Requirements:
1. Provide the fully corrected text preserving the author's intended tone while fixing grammar, punctuation, spelling, dangling modifiers, tense consistency, and awkward phrasing.
2. Provide a list of specific corrections made.
3. Provide an overall writing quality rating (0-100) and a brief summary of improvements.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You are an expert copyeditor, linguist, and grammar engine. Return valid JSON only.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Overall grammar and clarity score 0 to 100' },
            summary: { type: Type.STRING, description: 'Brief 1-2 sentence executive summary of improvements' },
            correctedText: { type: Type.STRING, description: 'The complete revised, error-free text' },
            correctionsCount: { type: Type.INTEGER, description: 'Total count of corrections' },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: 'Original erroneous or weak phrase' },
                  replacement: { type: Type.STRING, description: 'Corrected replacement' },
                  category: { type: Type.STRING, description: 'Grammar, Punctuation, Spelling, Vocabulary, or Syntax' },
                  explanation: { type: Type.STRING, description: 'Concise explanation of rule or improvement' },
                },
                required: ['original', 'replacement', 'category', 'explanation'],
              },
            },
          },
          required: ['score', 'summary', 'correctedText', 'correctionsCount', 'corrections'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    return handleGenAiError(res, error, 'grammar agent');
  }
});

// 3. Adaptive Paraphrasing Agent
app.post('/api/agent/paraphrase', async (req: Request, res: Response) => {
  try {
    const { text, tone = 'Standard', preserveKeywords = [] } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const keywordsNote =
      Array.isArray(preserveKeywords) && preserveKeywords.length > 0
        ? `Strictly preserve these key terms verbatim without substitution: ${preserveKeywords.join(', ')}`
        : 'Preserve essential proper nouns and domain terms.';

    const prompt = `You are a Master Paraphrasing and Rephrasing Agent.
Style/Tone target: "${tone}".
${keywordsNote}

Text to paraphrase:
"""
${text}
"""

Generate 3 high-quality, distinct variations matching the tone "${tone}".
- Variation 1: Natural & Fluent (balanced, seamless flow)
- Variation 2: Impactful & Sharp (crisp, confident, memorable)
- Variation 3: Stylistic Master (deeply embraces the chosen tone "${tone}")`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You are a professional rewritist and phrasing specialist. Deliver distinct, compelling rephrasings in valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            toneApplied: { type: Type.STRING },
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                  highlights: { type: Type.STRING, description: 'Brief note on how this variation differs' },
                },
                required: ['title', 'text', 'highlights'],
              },
            },
            vocabularyEnhancements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  from: { type: Type.STRING },
                  to: { type: Type.STRING },
                  context: { type: Type.STRING },
                },
                required: ['from', 'to'],
              },
            },
          },
          required: ['toneApplied', 'variations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    return handleGenAiError(res, error, 'paraphrase agent');
  }
});

// 4. Executive Condenser & Summarizer Agent
app.post('/api/agent/summarize', async (req: Request, res: Response) => {
  try {
    const { text, format = 'bullets', length = 'moderate' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `You are an Executive Summarizer and Information Condenser Agent.
Target Format: "${format}" (options: 'executive', 'bullets', 'tldr', 'action_items', 'structured_outline')
Target Reduction/Length: "${length}" (brief = ~25% original, moderate = ~50% original, detailed = ~75% original)

Input Text:
"""
${text}
"""

Analyze and extract the core thesis, vital supporting evidence, and actionable conclusions.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You synthesize complex text into high-signal, zero-fluff briefings. Return valid JSON only.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tldr: { type: Type.STRING, description: 'Single sentence core takeaway' },
            summary: { type: Type.STRING, description: 'Formatted summary content in markdown' },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key points extracted',
            },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Action items or recommendations if applicable',
            },
            stats: {
              type: Type.OBJECT,
              properties: {
                originalWords: { type: Type.INTEGER },
                summaryWords: { type: Type.INTEGER },
                compressionRate: { type: Type.STRING, description: 'e.g. 68% reduction' },
                readingTimeSavedMinutes: { type: Type.STRING },
              },
              required: ['originalWords', 'summaryWords', 'compressionRate'],
            },
          },
          required: ['tldr', 'summary', 'keyTakeaways', 'stats'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    return handleGenAiError(res, error, 'summarize agent');
  }
});

// 5. AI-to-Human Text Naturalizer (Anti-AI Detector & Humanizer)
app.post('/api/agent/humanize', async (req: Request, res: Response) => {
  try {
    const { text, persona = 'Conversational & Authentic' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `You are a Master AI-to-Human Voice Naturalizer and Stylistic De-roboticizer.
Target Voice Persona: "${persona}"

Analyze the following text:
"""
${text}
"""

Tasks:
1. Detect AI indicators: overly uniform sentence lengths, robotic formulaic transitions ("Furthermore", "In conclusion", "It is crucial to remember", "A testament to"), buzzword overuse ("delve", "tapestry", "beacon"), predictable syntax.
2. Estimate the initial AI Probability score (0-100%).
3. Rewrite the text completely into genuine, engaging, human prose. Introduce rhythmic burstiness (varying short and long sentences), natural idioms, human warmth, authentic cadence, and realistic voice while maintaining all underlying facts.
4. Estimate the post-humanization AI Probability score (should be 5-15%).
5. List key synthetic patterns eliminated.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You are an expert writer who transforms robotic, formulaic AI text into vivid, rhythmic, human-written text. Return valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            initialAiProbability: { type: Type.INTEGER, description: 'Estimated AI score of original text 0-100%' },
            finalAiProbability: { type: Type.INTEGER, description: 'Estimated AI score of humanized text' },
            roboticFlagsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'AI clichés and robotic traits found',
            },
            humanizedText: { type: Type.STRING, description: 'The naturally rewritten human-like text' },
            naturalCadenceTechniques: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Techniques used (e.g., burstiness, active voice, varied rhythm)',
            },
          },
          required: [
            'initialAiProbability',
            'finalAiProbability',
            'roboticFlagsDetected',
            'humanizedText',
            'naturalCadenceTechniques',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    return handleGenAiError(res, error, 'humanize agent');
  }
});

// 6. Master Prompt Architect & Optimizer
app.post('/api/agent/prompt-architect', async (req: Request, res: Response) => {
  try {
    const { rawPrompt, targetModel = 'Gemini', goal = 'General' } = req.body;
    if (!rawPrompt || typeof rawPrompt !== 'string') {
      return res.status(400).json({ error: 'Raw prompt is required' });
    }

    const prompt = `You are a World-Class Prompt Engineer and Prompt Architect.
Target Model: ${targetModel}
Objective Domain: ${goal}

Raw User Prompt / Idea:
"""
${rawPrompt}
"""

Transform this raw prompt into an ultra-high-performance production-grade prompt.
Include:
1. System Role & Persona definition
2. Clear Task Objective & Context
3. Strict Constraints & Formatting Specifications
4. Few-shot demonstration or Chain-of-Thought guidance if beneficial
5. Negative Constraints (what the AI must NOT do)
6. A ready-to-copy complete engineered prompt`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You build state-of-the-art prompts utilizing best practices from Anthropic, Google, and OpenAI research. Return valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedPrompt: { type: Type.STRING, description: 'The complete, copy-pasteable engineered prompt' },
            architecture: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                task: { type: Type.STRING },
                constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
                guardrails: { type: Type.ARRAY, items: { type: Type.STRING } },
                outputFormat: { type: Type.STRING },
              },
              required: ['role', 'task', 'constraints', 'guardrails', 'outputFormat'],
            },
            promptQualityScore: { type: Type.INTEGER, description: 'Calculated score from 0 to 100' },
            recommendedTemperature: { type: Type.STRING },
            testInputExample: { type: Type.STRING, description: 'A sample input to try with this prompt' },
          },
          required: ['optimizedPrompt', 'architecture', 'promptQualityScore'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    return handleGenAiError(res, error, 'prompt architect agent');
  }
});

// 7. Readability, Tone & Originality Deep Analyzer
app.post('/api/agent/analyze', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const readingTimeMin = Math.max(1, Math.round(words / 200));
    const speakingTimeMin = Math.max(1, Math.round(words / 130));

    const prompt = `You are a Deep Literary & Linguistic Analytics Agent.
Analyze this text:
"""
${text}
"""

Evaluate:
1. Readability Level (Grade level e.g. "8th Grade", "High School", "College Undergraduate")
2. Flesch Reading Ease score (0 to 100)
3. Tone Attributes (Formality, Emotional Valence, Assertiveness, Clarity)
4. Sentiment Analysis
5. Overused / Repetitive words or phrases
6. Top 3 actionable suggestions to elevate the writing`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You provide deep literary diagnostics and readability metrics. Return valid JSON only.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fleschScore: { type: Type.INTEGER, description: 'Flesch reading ease 0-100' },
            gradeLevel: { type: Type.STRING, description: 'e.g., 9th Grade, College, Professional' },
            sentiment: { type: Type.STRING, description: 'Positive, Neutral, Critical, or Mixed' },
            dominantTone: { type: Type.STRING, description: 'e.g. Authoritative, Persuasive, Casual' },
            toneBreakdown: {
              type: Type.OBJECT,
              properties: {
                formality: { type: Type.INTEGER, description: '0 to 100%' },
                confidence: { type: Type.INTEGER, description: '0 to 100%' },
                clarity: { type: Type.INTEGER, description: '0 to 100%' },
                engagement: { type: Type.INTEGER, description: '0 to 100%' },
              },
              required: ['formality', 'confidence', 'clarity', 'engagement'],
            },
            overusedWords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actionableRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'fleschScore',
            'gradeLevel',
            'sentiment',
            'dominantTone',
            'toneBreakdown',
            'actionableRecommendations',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      wordCount: words,
      charCount: chars,
      readingTimeMinutes: readingTimeMin,
      speakingTimeMinutes: speakingTimeMin,
    });
  } catch (error) {
    return handleGenAiError(res, error, 'analyzer agent');
  }
});

// 8. Multimodal Vision OCR & Smart Transcriber
app.post('/api/agent/ocr', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/png', formatPrompt = 'Clean Text' } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Image base64 data is required' });
    }

    // Clean data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/png',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `Extract all readable text, handwriting, diagram labels, and tables from this image with high accuracy.
Output style requested: ${formatPrompt}.
Also identify the document type (e.g. Handwritten Note, Book Page, Receipt, Screenshot, Slide, Code) and provide a concise summary.`,
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction:
          'You are an advanced OCR and document intelligence engine. Extract and format text accurately. Return valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: { type: Type.STRING, description: 'e.g. Receipt, Handwritten Note, Screenshot' },
            extractedText: { type: Type.STRING, description: 'Extracted text preserved in structured markdown' },
            confidence: { type: Type.STRING, description: 'High, Moderate, or Low' },
            wordCount: { type: Type.INTEGER },
            notes: { type: Type.STRING, description: 'Any formatting observations or ambiguities' },
          },
          required: ['documentType', 'extractedText', 'confidence', 'wordCount'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    return handleGenAiError(res, error, 'ocr vision agent');
  }
});

// 9. Interactive Writing Co-Pilot & Chat Agent
app.post('/api/agent/copilot', async (req: Request, res: Response) => {
  try {
    const { messages, documentContext, instruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const historyPrompt = messages
      .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    const prompt = `You are BrainBoom Co-Pilot, an intelligent AI writing collaborator and editorial advisor.
${documentContext ? `Current Working Document Context:\n"""\n${documentContext}\n"""\n` : ''}
${instruction ? `Special Instruction: ${instruction}\n` : ''}

Conversation history:
${historyPrompt}

Provide an insightful, helpful, directly actionable response. If generating text, format with clear markdown.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You are BrainBoom Co-Pilot, a world-class writing partner, editor, and creative catalyst. Give clear, elegant, and directly usable responses.',
      },
    });

    return res.json({
      reply: response.text ?? '',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleGenAiError(res, error, 'copilot agent');
// 10. Direct Git Push to GitHub
app.post('/api/git/push', async (req: Request, res: Response) => {
  try {
    const { token, username = 'Shlok1729', repo = 'ai-agent' } = req.body;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'GitHub Personal Access Token is required to authenticate push.' });
    }

    const cleanToken = token.trim();
    const cleanUser = username.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanRepo = repo.trim().replace(/[^a-zA-Z0-9_.-]/g, '');

    const pushUrl = `https://${cleanToken}@github.com/${cleanUser}/${cleanRepo}.git`;

    const { stdout, stderr } = await execPromise(`git push -u "${pushUrl}" main`, {
      timeout: 30000,
    });

    return res.json({
      success: true,
      message: `Successfully published repository to https://github.com/${cleanUser}/${cleanRepo}!`,
      output: stdout || stderr || 'Pushed successfully.',
    });
  } catch (err: unknown) {
    console.error('Git push error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    const sanitized = msg.replace(/https:\/\/[^@]+@/g, 'https://***@');
    return res.status(500).json({
      error: `Failed to push to GitHub: ${sanitized}`,
    });
  }
});

// Dev vs Prod Vite middleware configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BrainBoom AI Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
