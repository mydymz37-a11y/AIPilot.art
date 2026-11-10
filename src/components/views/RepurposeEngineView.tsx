import React, { useState } from 'react';
import {
  Repeat,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Save,
  Layers,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlatformType, ContentPost } from '../../types';

export const RepurposeEngineView: React.FC = () => {
  const {
    activeBrand,
    createPost,
    showToast,
    consumeCredit,
    setCurrentView,
  } = useApp();

  const [mainIdea, setMainIdea] = useState(
    'Why legacy enterprise software deployment taking 6 months destroys SaaS ROI, and how autonomous 7-day setup is shifting the industry standard.'
  );
  const [targetAudience, setTargetAudience] = useState(
    activeBrand?.targetAudience || 'Modern Tech CROs & Founders'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  interface RepurposedItem {
    platform: PlatformType;
    hook: string;
    content: string;
    cta: string;
    visualDirection: string;
    hashtags: string[];
  }

  const [packageTitle, setPackageTitle] = useState('Omnichannel Rollout: 7-Day Velocity Paradigm');
  const [items, setItems] = useState<RepurposedItem[]>([
    {
      platform: 'linkedin',
      hook: 'If your enterprise software rollout takes 6 months, you haven\'t purchased software. You\'ve adopted a consulting tax.',
      content: `We surveyed 120 VP of Sales Ops who switched providers in 2025.\n\nAverage time-to-value on legacy platforms: 184 days.\nAverage setup time on NexusFlow: 7 days.\n\nIn those 6 months of waiting:\n• 2 sales quarters pass without pipeline visibility\n• Deal drift goes unchecked\n• Reps build shadow spreadsheets that destroy forecast integrity\n\nSpeed of deployment is not a convenience. It is your competitive advantage.`,
      cta: 'Benchmark your team\'s deployment velocity in our free 2026 audit.',
      visualDirection: 'Clean 4-slide PDF carousel comparing 184-day vs 7-day deployment curve with high-contrast data charts.',
      hashtags: ['#RevOps', '#SaaSLeadership', '#SalesOperations', '#Growth'],
    },
    {
      platform: 'x',
      hook: 'The biggest lie in enterprise B2B:\n\n"It takes 6 months to implement because it\'s robust."',
      content: `No, it takes 6 months because the architecture is from 2014.\n\nModern tools connect in 12 minutes and deliver 94% predictive forecasting in 7 days.\n\nStop paying six-figure consulting fees to configure outdated software.`,
      cta: 'Bookmark this thread before signing your next software contract.',
      visualDirection: 'High-contrast typography card with dark navy background and cyan highlight line.',
      hashtags: ['#B2B', '#Startups', '#RevOps'],
    },
    {
      platform: 'instagram',
      hook: 'Save this post: Why 6-month software implementations are officially dead 📌',
      content: `Ever wonder why buying software feels like starting a whole new construction project?\n\nSwipe through to see the 3 reasons forward-thinking tech teams are firing their legacy software stacks this quarter ➡️\n\n1. Opaque consulting contracts\n2. Mandatory rep compliance friction\n3. Zero predictive accuracy until month 7\n\nModern leverage means instant results.`,
      cta: 'Tap link in bio to explore our live interactive tour.',
      visualDirection: 'Aesthetic 1080x1350 editorial carousel slide with clean serif headline and sleek dashboard glassmorphism.',
      hashtags: ['#SaaSGrowth', '#ProductivityHacks', '#BusinessStrategy', '#FounderTips'],
    },
    {
      platform: 'tiktok',
      hook: '[Camera punch-in] "If you run an online company or manage clients, stop doing this one thing immediately."',
      content: `[Cut to screen recording of chaotic spreadsheets]\n"Look at how much money companies burn waiting for their sales tools to go live.\n\nInstead of wasting 6 months on consulting calls, watch this:\nWe connect our CRM, and within literally 7 days the AI models our forecast with 94% accuracy.\n\nStop overcomplicating your stack."`,
      cta: 'Link in bio to test it out free.',
      visualDirection: 'High-energy UGC talking head with fast cuts and sound effects.',
      hashtags: ['#MarketingHacks', '#EntrepreneurLife', '#TechReview'],
    },
    {
      platform: 'facebook',
      hook: 'Are you tired of waiting half a year just to see if your new business software actually works?',
      content: `We recently broke down why legacy 6-month deployment cycles are costing mid-market companies tens of thousands in wasted revenue.\n\nIn our latest case study, we showcase how modern teams achieve complete pipeline certainty in under 7 days.\n\nRead the full teardown and grab our free migration checklist below!`,
      cta: 'Click below to read the teardown.',
      visualDirection: 'High-res mockup of executive tablet displaying real-time analytics.',
      hashtags: ['#BusinessOps', '#SmallBusinessGrowth'],
    },
    {
      platform: 'youtube',
      hook: 'Why 6-month software rollouts fail 80% of the time ⏱️',
      content: `[0-5s]: "If a software vendor tells you implementation takes 6 months, run."\n[5-30s]: "In 6 months, your market shifts, your team turns over, and your forecast becomes obsolete."\n[30-60s]: "Watch how autonomous telemetry gives you answers in 7 days."`,
      cta: 'Subscribe for daily 60-second tech teardowns.',
      visualDirection: 'Fast 9:16 vertical motion graphic with sound design markers.',
      hashtags: ['#Shorts', '#TechAdvice', '#SaaS'],
    },
    {
      platform: 'pinterest',
      hook: 'The Complete 2026 Software Implementation & Migration Checklist',
      content: 'Learn how to transition away from clunky legacy enterprise suites in 7 days without losing pipeline telemetry. Free downloadable PDF framework for modern operations teams and founders.',
      cta: 'Click through to download the checklist.',
      visualDirection: 'Vertical 1000x1500 aesthetic editorial pin with clean typography and brand colors.',
      hashtags: ['#Checklist', '#Productivity', '#TechGuide'],
    },
  ]);

  const handleGeneratePackage = async () => {
    if (!consumeCredit(5)) return;

    setIsGenerating(true);
    showToast('One-to-Many Engine is synthesizing 7 platform formats...', 'info');

    try {
      const res = await fetch('/api/ai/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: activeBrand,
          mainIdea,
          targetAudience,
        }),
      });

      const data = await res.json();
      if (data.success && data.package) {
        setPackageTitle(data.package.title || 'Coordinated Omnichannel Campaign');
        if (data.package.items && Array.isArray(data.package.items)) {
          setItems(data.package.items);
        }
        showToast('Synchronized 7-platform package generated!', 'success');
      }
    } catch {
      showToast('Generation failed. Check connection.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyItem = (item: RepurposedItem, idx: number) => {
    const text = `${item.hook}\n\n${item.content}\n\n${item.cta}\n\n${item.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    showToast(`Copied ${item.platform.toUpperCase()} post!`, 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleScheduleAllToCalendar = () => {
    const today = new Date();
    let count = 0;

    items.forEach((item, idx) => {
      const schedDate = new Date(today);
      schedDate.setDate(today.getDate() + (idx * 2 + 1));

      const post: Omit<ContentPost, 'id' | 'createdAt' | 'updatedAt'> = {
        brandId: activeBrand?.id || 'brand-1',
        platform: item.platform,
        title: `${packageTitle} — ${item.platform.toUpperCase()}`,
        hook: item.hook,
        bodyText: item.content,
        callToAction: item.cta,
        hashtags: item.hashtags,
        tone: activeBrand?.brandVoice || 'Authoritative & Engaging',
        characterCount: item.content.length + item.hook.length,
        status: 'ready_to_publish',
        scheduledDate: schedDate.toISOString().split('T')[0],
        scheduledTime: '11:00',
        approvalStatus: 'approved',
      };
      createPost(post);
      count++;
    });

    showToast(`Scheduled all ${count} posts across the next 14 calendar days!`, 'success');
    setCurrentView('content_calendar');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-violet-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-400 mb-2">
            <Repeat className="h-3.5 w-3.5" />
            <span>Module 5: One-to-Many Repurposing Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            1 Idea → 7 Synchronized Platform Packages
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Input a single founder insight, case study, or product announcement. The engine transforms it into 7 platform-native assets tailored for LinkedIn, X, Instagram, TikTok, Facebook, YouTube, and Pinterest.
          </p>
        </div>

        <button
          onClick={handleScheduleAllToCalendar}
          className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] whitespace-nowrap"
        >
          <Calendar className="h-4 w-4" />
          <span>Schedule Entire Package to Calendar</span>
        </button>
      </div>

      {/* Input Directive Card */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Core Master Content Idea or Transcript
          </label>
          <textarea
            rows={3}
            value={mainIdea}
            onChange={(e) => setMainIdea(e.target.value)}
            placeholder="Type or paste your primary thesis, customer win story, or product announcement..."
            className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400">
            Active Brand Target: <strong className="text-white">{activeBrand?.name}</strong>
          </div>

          <button
            onClick={handleGeneratePackage}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Synthesizing 7 Platforms...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Coordinated 7-Platform Package</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Synchronized Package Preview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-4 w-4 text-violet-400" />
            <span>{packageTitle}</span>
          </h3>
          <span className="text-xs text-slate-400">7 Native Format Variations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => {
            const isCopied = copiedIndex === idx;
            return (
              <div
                key={item.platform}
                className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
              >
                <div>
                  {/* Platform & Copy Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {item.platform}
                    </span>
                    <button
                      onClick={() => handleCopyItem(item, idx)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hook */}
                  <div className="mb-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-0.5">
                      Opening Hook
                    </div>
                    <p className="text-xs font-bold text-slate-100 leading-snug">
                      "{item.hook}"
                    </p>
                  </div>

                  {/* Content Body */}
                  <div className="mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Native Body
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-line line-clamp-6 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                      CTA
                    </div>
                    <p className="text-xs text-emerald-300 font-medium">{item.cta}</p>
                  </div>

                  {/* Visual Direction */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-400 mb-3">
                    <strong className="text-slate-300 block mb-0.5">Visual Asset Concept:</strong>
                    {item.visualDirection}
                  </div>
                </div>

                {/* Hashtags & Schedule Quick Button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-cyan-400 truncate max-w-[170px]">
                    {item.hashtags.join(' ')}
                  </div>
                  <button
                    onClick={() => {
                      const post: Omit<ContentPost, 'id' | 'createdAt' | 'updatedAt'> = {
                        brandId: activeBrand?.id || 'brand-1',
                        platform: item.platform,
                        title: `${packageTitle} — ${item.platform.toUpperCase()}`,
                        hook: item.hook,
                        bodyText: item.content,
                        callToAction: item.cta,
                        hashtags: item.hashtags,
                        tone: activeBrand?.brandVoice || 'Direct & High-Converting',
                        characterCount: item.content.length + item.hook.length,
                        status: 'ready_to_publish',
                        scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                        scheduledTime: '10:00',
                        approvalStatus: 'approved',
                      };
                      createPost(post);
                      showToast(`Added ${item.platform.toUpperCase()} to Calendar!`, 'success');
                    }}
                    className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-0.5"
                  >
                    <span>+ Calendar</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
