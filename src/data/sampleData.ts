export interface SampleItem {
  id: string;
  name: string;
  agent: string;
  text: string;
  tone?: string;
  format?: string;
  model?: string;
  imageBase64?: string;
}

export const SAMPLE_TEXTS: Record<string, { label: string; text: string; details?: string }> = {
  grammar: {
    label: 'Cluttered Business Proposal with Errors',
    text: `Their is several reasons why our team didnt achieved the Q3 sales quota. First off, the marketing campaigns was launched two weeks later than planned, which impacted customer acquisitions heavily. Furthermore, none of the sales managers has had time to update their CRM records, creating much confusions across departments. We should of addressed this sooner, but between you and I, management wasn't receptive to feedback. Going forward, its crucial that we implements automated pipeline tracking so everyone know their daily targets.`,
    details: 'Contains subject-verb disagreement, homophone errors ("their/there", "should of", "between you and I"), comma splices, and inconsistent tense.',
  },
  paraphrase: {
    label: 'Dense Academic Research Intro',
    text: `The proliferation of transformer-based foundation models has catalyzed a paradigm shift across computational linguistics. Notwithstanding their unprecedented zero-shot reasoning competencies, these architectures frequently exhibit epistemic hallucinations and stochastic vulnerability when subjected to out-of-distribution prompts, thereby necessitating robust guardrail frameworks in high-stakes domain deployments.`,
    details: 'Complex vocabulary, academic jargon, and compound sentences.',
  },
  summarize: {
    label: 'Product Strategy & Quarterly Memo',
    text: `Over the past six months, user churn in our mobile SaaS client increased by 14.2%, predominantly concentrated among users in their second billing month. Comprehensive customer exit interviews highlighted three primary friction points: onboarding cognitive overload, latency in workspace synchronization exceeding 3.8 seconds during peak hours, and an opaque pricing tier progression for expanding team seats.

To reverse this trajectory, engineering will immediately transition our socket architecture to lightweight edge brokers, targeting a P95 sync latency of under 400 milliseconds by December 15th. Simultaneously, the design division will roll out a 3-step interactive onboarding flow to replace the existing 12-page walkthrough modal. Marketing and Growth will institute a personalized 45-day retention lifecycle sequence featuring contextual productivity tips and dynamic discounts for accounts adding secondary collaborators. We project these interventions will reduce quarterly churn to sub-6% and restore net revenue retention to 118% by Q2.`,
    details: 'Detailed metrics, root cause analysis, tactical cross-team assignments, and timeline projections.',
  },
  humanize: {
    label: 'Robotic AI-Generated Marketing Pitch',
    text: `In today's fast-paced digital landscape, innovation is not merely a buzzword; it is a vital catalyst for unprecedented synergy. It is important to remember that organizations must harness the transformative power of holistic methodologies to thrive in an ever-evolving marketplace. Furthermore, our cutting-edge paradigm serves as a testament to our steadfast commitment to operational excellence. Delving deep into the multifaceted tapestry of enterprise workflows, we seamlessly bridge the gap between strategic vision and frictionless execution. In conclusion, by embracing this revolutionary framework, stakeholders can unlock boundless horizons of sustainable growth.`,
    details: 'Classic AI tropes: "fast-paced digital landscape", "vital catalyst", "testament to", "delving deep into the tapestry", "in conclusion".',
  },
  promptArchitect: {
    label: 'Raw Vague Request',
    text: `write me an email to ask my boss for a raise and promotion because i worked really hard this year and took on extra projects`,
    details: 'Needs conversion into a high-tier prompt with persona, quantifiable impact framework, risk mitigations, and negotiation strategies.',
  },
  analyze: {
    label: 'Executive Op-Ed on AI Automation',
    text: `The integration of autonomous systems into knowledge work is undeniably accelerating. While speculative narratives tend to polarize between apocalyptic job destruction and utopian leisure, the realistic trajectory is nuanced friction. Automation decomposes conventional roles into granular tasks, systematically commoditizing standardized drafting while dramatically elevating executive judgment, taste, and high-context decision making. Those who adapt their workflow leverage a tenfold cognitive multiplier; those who resist risk becoming bottlenecks in their own organizations.`,
    details: 'Evaluates reading grade level, assertiveness, formality, and lexical variance.',
  },
};

// Built-in sample SVG/PNG base64 images for OCR test
export const SAMPLE_OCR_IMAGES = [
  {
    name: 'Handwritten Meeting Notes',
    description: 'Quick whiteboard scribble with sprint tasks',
    // 1x1 clean SVG rendered to base64
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300" style="background:%23fbfbf6;"><rect width="100%" height="100%" fill="%23fffbee" stroke="%23e2e8f0"/><text x="40" y="50" font-family="cursive, serif" font-size="22" font-weight="bold" fill="%231e293b">Sprint 42 Brainstorm Notes (Oct 29)</text><line x1="40" y1="65" x2="520" y2="65" stroke="%233b82f6" stroke-width="2"/><text x="40" y="105" font-family="cursive, serif" font-size="18" fill="%23334155">• Ship Gemini 3.8 Flash agent migration</text><text x="40" y="145" font-family="cursive, serif" font-size="18" fill="%23334155">• Fix grammar diff highlighting on mobile</text><text x="40" y="185" font-family="cursive, serif" font-size="18" fill="%23334155">• Target: 5,000 words per minute throughput</text><text x="40" y="225" font-family="cursive, serif" font-size="18" fill="%23334155">• Action: Prepare GitHub publication README</text><text x="40" y="270" font-family="cursive, serif" font-size="16" fill="%2364748b">Owner: Dev Team | Priority: Critical</text></svg>',
  },
  {
    name: 'Invoice / Expense Receipt',
    description: 'Formatted receipt with line items and totals',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="320" viewBox="0 0 600 320" style="background:%23ffffff;"><rect width="100%" height="100%" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="40" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">CLOUD COMPUTE LABS - INVOICE #8921</text><text x="40" y="80" font-family="monospace" font-size="14" fill="%2364748b">Date: 2026-10-29 | Billed To: Enterprise Client</text><line x1="40" y1="100" x2="560" y2="100" stroke="%2394a3b8" stroke-dasharray="4"/><text x="40" y="130" font-family="monospace" font-size="15" fill="%231e293b">1. Gemini 3.8 Flash API Tokens (5M tokens)   $35.00</text><text x="40" y="165" font-family="monospace" font-size="15" fill="%231e293b">2. Edge Server CDN Ingress (Asia-East)       $12.50</text><text x="40" y="200" font-family="monospace" font-size="15" fill="%231e293b">3. Agent Orchestration Pipeline               $20.00</text><line x1="40" y1="220" x2="560" y2="220" stroke="%2394a3b8"/><text x="40" y="255" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">SUBTOTAL: $67.50   |   TAX (8%): $5.40</text><text x="40" y="290" font-family="sans-serif" font-size="18" font-weight="bold" fill="%232563eb">TOTAL DUE: $72.90 USD (PAID)</text></svg>',
  },
];
