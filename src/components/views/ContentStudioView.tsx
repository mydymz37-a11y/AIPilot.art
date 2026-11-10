import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  Copy,
  Check,
  Save,
  Calendar,
  RefreshCw,
  Send,
  Sliders,
  Type,
  Hash,
  ArrowRightLeft,
  ChevronDown,
  Layers,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlatformType, ContentPost } from '../../types';
import { PLATFORM_LIMITS, getPlatformLimit } from '../../utils/metrics';

export const ContentStudioView: React.FC = () => {
  const {
    activeBrand,
    campaigns,
    createPost,
    showToast,
    consumeCredit,
    setCurrentView,
  } = useApp();

  const [platform, setPlatform] = useState<PlatformType>('linkedin');
  const [contentIdea, setContentIdea] = useState('');
  const [objective, setObjective] = useState('Lead Generation');
  const [tone, setTone] = useState(activeBrand?.brandVoice || 'Authoritative & Pragmatic');
  const [campaignId, setCampaignId] = useState<string>('');
  const [referenceText, setReferenceText] = useState('');

  // Generated post state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [postTitle, setPostTitle] = useState('High-Impact Thought Leadership');
  const [postHook, setPostHook] = useState(
    '7 out of 10 enterprise sales forecasts miss their target by more than 15%.'
  );
  const [postBody, setPostBody] = useState(
    `We audited 450,000 enterprise deal cycles across 60 B2B tech companies.\n\nHere is what we discovered:\n\n1. "Stage 3 - Discovery Completed" lingers an average of 42 days without single executive champion validation.\n2. In 68% of lost deals, the forecast category remained "Commit" until day 84 of a 90-day quarter.\n3. Reps spend 4.6 hours every Friday manually massaging spreadsheet columns that become obsolete by Monday morning.\n\nPredictable revenue is not a talent problem. It is a telemetry problem.`
  );
  const [postCTA, setPostCTA] = useState(
    'Explore the full 24-page 2026 Enterprise Pipeline Benchmark Report.'
  );
  const [hashtags, setHashtags] = useState<string[]>([
    '#RevOps',
    '#B2BGrowth',
    '#RevenueIntelligence',
  ]);
  const [visualPrompt, setVisualPrompt] = useState(
    'Split-screen minimalist visual: Left showing messy spreadsheets, right showing sleek high-contrast navy dashboard.'
  );

  // Calendar scheduling modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('10:00');

  const charLimit = getPlatformLimit(platform);
  const fullText = `${postHook ? postHook + '\n\n' : ''}${postBody}\n\n${postCTA ? postCTA + '\n\n' : ''}${hashtags.join(' ')}`;
  const currentChars = fullText.length;
  const isOverLimit = currentChars > charLimit;

  // Handle Generate Post
  const handleGeneratePost = async () => {
    if (!consumeCredit(2)) return;

    setIsGenerating(true);
    showToast(`Generating high-converting ${platform.toUpperCase()} post...`, 'info');

    try {
      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: activeBrand,
          platform,
          promptIdea: contentIdea || 'Key benefits and strategic differentiation',
          objective,
          tone,
          articleText: referenceText,
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPostTitle(data.post.title || `${platform.toUpperCase()} Content`);
        setPostHook(data.post.hook || '');
        setPostBody(data.post.bodyText || '');
        setPostCTA(data.post.callToAction || '');
        setHashtags(data.post.hashtags || []);
        if (data.post.visualPrompt) setVisualPrompt(data.post.visualPrompt);
        showToast('Post generated with platform formatting!', 'success');
      }
    } catch {
      showToast('Generation encountered an issue, check network.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Quick Content Actions
  const handleContentAction = async (action: string) => {
    if (!consumeCredit(1)) return;

    setIsActionLoading(true);
    showToast(`Applying "${action}"...`, 'info');

    try {
      const res = await fetch('/api/ai/content-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          currentText: postBody,
          platform,
          brand: activeBrand,
        }),
      });
      const data = await res.json();
      if (data.success && data.modifiedText) {
        setPostBody(data.modifiedText);
        showToast(data.explanation || `Updated with ${action}!`, 'success');
      }
    } catch {
      showToast('Could not apply action.', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast('Post copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveDraft = () => {
    const post: Omit<ContentPost, 'id' | 'createdAt' | 'updatedAt'> = {
      brandId: activeBrand?.id || 'brand-1',
      campaignId: campaignId || undefined,
      platform,
      title: postTitle,
      hook: postHook,
      bodyText: postBody,
      callToAction: postCTA,
      hashtags,
      tone,
      characterCount: currentChars,
      status: 'draft',
      approvalStatus: 'pending',
    };
    createPost(post);
    showToast('Saved as draft in workspace', 'success');
  };

  const handleConfirmSchedule = () => {
    const post: Omit<ContentPost, 'id' | 'createdAt' | 'updatedAt'> = {
      brandId: activeBrand?.id || 'brand-1',
      campaignId: campaignId || undefined,
      platform,
      title: postTitle,
      hook: postHook,
      bodyText: postBody,
      callToAction: postCTA,
      hashtags,
      tone,
      characterCount: currentChars,
      status: 'ready_to_publish',
      scheduledDate,
      scheduledTime,
      approvalStatus: 'approved',
    };
    createPost(post);
    setScheduleModalOpen(false);
    showToast(`Scheduled in Content Calendar for ${scheduledDate} at ${scheduledTime}`, 'success');
  };

  const contentActions = [
    'Improve Hook',
    'Make More Persuasive',
    'Make More Professional',
    'Make More Conversational',
    'Shorten',
    'Expand',
    'Simplify',
    'Add CTA',
    'Generate Hashtags',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <PenTool className="h-3.5 w-3.5" />
            <span>Module 4: Advanced AI Content Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Social Content Creation Studio</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Generate native, platform-specific copy calibrated to your brand voice, character restrictions, and audience psychology.
          </p>
        </div>

        {activeBrand && (
          <div className="text-xs text-slate-400 bg-slate-800/60 rounded-xl px-3 py-2 border border-slate-700/60">
            Active Brand Context: <strong className="text-indigo-300">{activeBrand.name}</strong>
          </div>
        )}
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {(['linkedin', 'instagram', 'x', 'tiktok', 'facebook', 'youtube', 'pinterest'] as PlatformType[]).map(
          (p) => {
            const active = platform === p;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>{PLATFORM_LIMITS[p]?.label || p}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  {PLATFORM_LIMITS[p]?.maxChars} chars
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* Two-Column Studio: Prompt Input on Left, Live Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Content Directive & Parameters</span>
            </h3>

            {/* Content Idea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Content Idea / Topic / Angle
              </label>
              <textarea
                rows={3}
                value={contentIdea}
                onChange={(e) => setContentIdea(e.target.value)}
                placeholder="e.g. Why sales forecast calls on Friday fail, and how automated CRM telemetry fixes pipeline slippage..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Campaign Objective */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Objective</label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Product Sales">Product Sales</option>
                  <option value="Thought Leadership">Thought Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tone</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g. Direct, Authoritative"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Link to Campaign */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Associate with Campaign (Optional)
              </label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Standalone Post --</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Reference Article / Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reference Notes / Transcript Snippet (Optional)
              </label>
              <textarea
                rows={2}
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                placeholder="Paste key takeaways, transcript quotes, or bullet points to adapt..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGeneratePost}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Drafting Native Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Platform Post</span>
                </>
              )}
            </button>
          </div>

          {/* Quick AI Refinement Actions */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Quick AI Actions & Variations</span>
              {isActionLoading && <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {contentActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleContentAction(action)}
                  disabled={isActionLoading}
                  className="rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition-colors disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Post Editor & Visual Concept (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {platform}
                </span>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-white focus:outline-none"
                />
              </div>

              {/* Character Limit Gauge */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold ${
                    isOverLimit ? 'text-rose-400' : 'text-slate-400'
                  }`}
                >
                  {currentChars} / {charLimit} chars
                </span>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverLimit ? 'bg-rose-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, (currentChars / charLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Opening Hook Field */}
            <div>
              <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Scroll-Stopping Opening Hook
              </label>
              <textarea
                rows={2}
                value={postHook}
                onChange={(e) => setPostHook(e.target.value)}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 p-3 text-xs font-semibold text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Body Text Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Post Caption / Script Body
              </label>
              <textarea
                rows={8}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="w-full rounded-xl bg-slate-800/50 border border-slate-700/80 p-3.5 text-xs text-slate-100 leading-relaxed font-sans focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Call to Action Field */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Call to Action (CTA)
              </label>
              <input
                type="text"
                value={postCTA}
                onChange={(e) => setPostCTA(e.target.value)}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Hashtags Field */}
            <div>
              <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags.join(' ')}
                onChange={(e) =>
                  setHashtags(
                    e.target.value
                      .split(' ')
                      .map((t) => (t.startsWith('#') ? t : `#${t}`))
                      .filter((t) => t.length > 1)
                  )
                }
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 text-xs font-mono text-cyan-300 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Visual Direction / Creative Brief */}
            {visualPrompt && (
              <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50 text-xs">
                <div className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-indigo-400" />
                  <span>Visual Concept Direction:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{visualPrompt}</p>
              </div>
            )}

            {/* Editor Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Copy Full Post</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Save className="h-3.5 w-3.5 text-slate-400" />
                  <span>Save Draft</span>
                </button>
              </div>

              <button
                onClick={() => setScheduleModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Add to Content Calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule to Calendar Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Schedule to Calendar</h3>
            <p className="text-xs text-slate-400 mb-4">
              Queue this {platform.toUpperCase()} post for publishing in your internal content calendar.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSchedule}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
