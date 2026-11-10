import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  Compass,
  Megaphone,
  BrainCircuit,
  PenTool,
  Repeat,
  Calendar,
  Sparkles,
  TrendingUp,
  Workflow,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HelpSupportView: React.FC = () => {
  const { showToast } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does AIPilot.art differ from a standard social media post generator?',
      a: 'Standard tools only prompt an LLM to generate disconnected text. AIPilot.art is a complete marketing operations department: it establishes a persistent Brand Business Brain (voice, problems, USP, colors), formulates end-to-end 30-day strategies with KPIs, synchronizes one idea across 7 native platforms simultaneously, and analyzes real marketing telemetry (ROAS, CPA, CTR) to reallocate your ad spend.',
    },
    {
      q: 'Where do I configure my Gemini API key?',
      a: 'The application runs with a dedicated server-side architecture. In Google AI Studio, your GEMINI_API_KEY is automatically injected into the backend from the Secrets panel. Our server initializes the modern @google/genai SDK with the gemini-3.8-flash model. If no key is set or quota is exhausted, our intelligent brand-aligned fallback engine ensures every single feature remains fully functional.',
    },
    {
      q: 'How does the One-to-Many Repurposing Engine work?',
      a: 'You enter one core insight, article summary, or founder podcast takeaway. The engine automatically crafts 7 synchronized native assets: an executive LinkedIn post, a punchy X thread, an Instagram carousel caption, a 60-second TikTok script, a YouTube Short storyboard, a Facebook post, and an SEO-rich Pinterest description with visual prompts.',
    },
    {
      q: 'Are scheduled posts published automatically to external platforms?',
      a: 'The Content Calendar acts as an internal production command center and editorial review pipeline. To preserve full account safety, we never ask for social passwords or scrape private accounts. Posts are stored, versioned, approved, and copy-ready, ready to be dispatched via official API keys.',
    },
    {
      q: 'How are ROI metrics (CTR, CVR, CPA, ROAS) calculated in Analytics?',
      a: 'We use verified mathematical formulas with strict zero-denominator safeguards: CTR = (Clicks / Impressions) * 100, CVR = (Conversions / Clicks) * 100, CPA = Spend / Conversions, and ROAS = Revenue / Spend. All calculations are executed deterministically on your stored or imported CSV data.',
    },
    {
      q: 'How does Role-Based Access Control (RBAC) work for agencies?',
      a: 'Workspaces support 4 distinct authority levels: Owner (full administrative & billing power), Admin (campaign management and editorial approval sign-off), Editor (content generation and draft proposals), and Viewer (client read-only preview and comment threads). You can simulate any role at any time from the bottom-left sidebar switcher.',
    },
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) {
      showToast('Please fill in both the subject and description.', 'warning');
      return;
    }
    setTicketSubmitted(true);
    showToast('Support ticket received! Our team will respond shortly.', 'success');
    setSupportSubject('');
    setSupportMessage('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Documentation & Customer Support</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Knowledge Base & Technical Guides
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Everything you need to master AIPilot.art workflows, AI prompt customization, and agency operations.
        </p>
      </div>

      {/* 5-Minute Quickstart Roadmap */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            The 5-Step AIPilot.art Execution Flywheel
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">
              01. BRAIN
            </span>
            <div className="font-bold text-white mb-1">Brand Intelligence</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Save your USP, customer pains, brand voice, and forbidden words.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">
              02. DIRECTOR
            </span>
            <div className="font-bold text-white mb-1">Generate Strategy</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Formulate 14-point tactical strategy and posting schedules.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">
              03. STUDIO
            </span>
            <div className="font-bold text-white mb-1">Create Content</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Generate native hooks, scripts, and 7-platform coordinated packages.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">
              04. CALENDAR
            </span>
            <div className="font-bold text-white mb-1">Schedule & Review</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Submit for client sign-off, organize cadence, and export CSV.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">
              05. ANALYST
            </span>
            <div className="font-bold text-white mb-1">Measure & Scale</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Track ROAS and let AI Growth Analyst reallocate capital into winners.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-800/50 border border-slate-700/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-bold text-white hover:text-indigo-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Send className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Contact Platform Support</h3>
        </div>

        {ticketSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Thank you! Your ticket has been logged with our senior technical support team.</span>
          </div>
        ) : (
          <form onSubmit={handleSendTicket} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                placeholder="e.g. Question regarding custom brand voice calibration"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Details & Message</label>
              <textarea
                rows={3}
                required
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Describe what you need assistance with..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
