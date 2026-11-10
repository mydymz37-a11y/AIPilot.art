import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  RefreshCw,
  Save,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Layers,
  Target,
  DollarSign,
  TrendingUp,
  Share2,
  Check,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarketingStrategy, PlatformType } from '../../types';

export const AIMarketingDirectorView: React.FC = () => {
  const {
    activeBrand,
    brands,
    saveStrategy,
    convertStrategyToCampaignAndCalendar,
    setCurrentView,
    consumeCredit,
    showToast,
  } = useApp();

  const [objective, setObjective] = useState('Lead Generation');
  const [productOrService, setProductOrService] = useState(
    activeBrand?.productsServices || 'Enterprise RevOps Platform'
  );
  const [targetAudience, setTargetAudience] = useState(
    activeBrand?.targetAudience || 'VPs of Sales & Chief Revenue Officers'
  );
  const [targetCountry, setTargetCountry] = useState('United States, UK & Canada');
  const [channels, setChannels] = useState<string[]>(['LinkedIn', 'X', 'Instagram']);
  const [durationDays, setDurationDays] = useState<7 | 14 | 30>(30);
  const [budget, setBudget] = useState('$3,500');
  const [offerPromotion, setOfferPromotion] = useState('Free 2026 Pipeline Audit & Benchmark');
  const [desiredOutcome, setDesiredOutcome] = useState('Book 50+ Qualified Executive Product Demos');

  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [generatedStrategy, setGeneratedStrategy] = useState<MarketingStrategy | null>(null);
  const [isConverted, setIsConverted] = useState(false);

  const availableObjectives = [
    'Brand Awareness',
    'Engagement',
    'Website Traffic',
    'Lead Generation',
    'Product Sales',
    'Customer Retention',
    'Product Launch',
  ];

  const availableChannels = ['LinkedIn', 'Instagram', 'X', 'Facebook', 'TikTok', 'YouTube', 'Pinterest'];

  const toggleChannel = (ch: string) => {
    if (channels.includes(ch)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== ch));
      } else {
        showToast('At least one channel must be selected.', 'warning');
      }
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleGenerate = async () => {
    if (!consumeCredit(5)) return;

    setIsGenerating(true);
    setIsConverted(false);
    showToast('AI Marketing Director is synthesizing comprehensive strategy...', 'info');

    try {
      const res = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: activeBrand,
          objective,
          productOrService,
          targetAudience,
          targetCountry,
          channels,
          durationDays,
          budget,
          offerPromotion,
          desiredOutcome,
        }),
      });

      const data = await res.json();
      if (data.success && data.strategy) {
        const fullStrategy: MarketingStrategy = {
          id: `strat-${Date.now()}`,
          brandId: activeBrand?.id || 'brand-1',
          title: `${objective} Master Strategy — ${productOrService}`,
          objective,
          productOrService,
          targetAudience,
          targetCountry,
          channels,
          durationDays,
          budget,
          offerPromotion,
          desiredOutcome,
          sections: data.strategy,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setGeneratedStrategy(fullStrategy);
        showToast('Full marketing strategy generated successfully!', 'success');
      } else {
        throw new Error('Invalid strategy response');
      }
    } catch (err) {
      showToast('Failed to generate strategy. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSection = async (sectionKey: string) => {
    if (!generatedStrategy) return;
    setRegeneratingSection(sectionKey);
    showToast(`Regenerating "${sectionKey}" section...`, 'info');

    try {
      const res = await fetch('/api/ai/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: activeBrand,
          sectionKey,
          currentData: (generatedStrategy.sections as any)[sectionKey],
          context: `${objective} for ${productOrService}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setGeneratedStrategy({
          ...generatedStrategy,
          sections: {
            ...generatedStrategy.sections,
            [sectionKey]: data.result,
          },
          updatedAt: new Date().toISOString(),
        });
        showToast(`Updated "${sectionKey}" section!`, 'success');
      }
    } catch {
      showToast('Could not regenerate section.', 'error');
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handleSave = () => {
    if (generatedStrategy) {
      saveStrategy(generatedStrategy);
    }
  };

  const handleConvertToCampaign = () => {
    if (!generatedStrategy) return;
    const { campaignId, postsCreated } = convertStrategyToCampaignAndCalendar(generatedStrategy);
    setIsConverted(true);
    showToast(`Converted into active campaign with ${postsCreated} calendar posts!`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
              <Compass className="h-3.5 w-3.5" />
              <span>Module 2: Autonomous Strategy Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              AI Marketing Director
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
              Turn your business profile into a high-converting, omnichannel marketing blueprint with structured target personas, positioning angles, 14-point tactical execution, and automated calendar conversion.
            </p>
          </div>

          {activeBrand && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3.5 py-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: activeBrand.brandColors.accent || '#6366F1' }}
              />
              <div className="text-xs">
                <div className="text-slate-400">Target Context:</div>
                <div className="font-bold text-white">{activeBrand.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strategy Generator Input Form */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-400" />
            <span>Campaign Parameters & Strategic Objectives</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            The AI automatically synthesizes your saved Brand Brain attributes (voice, problems, USP) with these specific campaign targets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Objective */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Marketing Objective
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
            >
              {availableObjectives.map((obj) => (
                <option key={obj} value={obj}>
                  {obj}
                </option>
              ))}
            </select>
          </div>

          {/* Product or Service */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Featured Product / Offer
            </label>
            <input
              type="text"
              value={productOrService}
              onChange={(e) => setProductOrService(e.target.value)}
              placeholder="e.g. NexusFlow Core Suite"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. CROs & VP of Sales Ops"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Target Country */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Target Geography
            </label>
            <input
              type="text"
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              placeholder="e.g. United States, UK, Canada"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Campaign Duration
            </label>
            <div className="flex gap-2">
              {([7, 14, 30] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationDays(d)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    durationDays === d
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Budget */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Campaign Budget
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. $3,500"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Special Offer / Hook */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Special Offer or Hook
            </label>
            <input
              type="text"
              value={offerPromotion}
              onChange={(e) => setOfferPromotion(e.target.value)}
              placeholder="e.g. Complimentary Pipeline Audit"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Desired Outcome */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Desired Primary Outcome
            </label>
            <input
              type="text"
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              placeholder="e.g. 50+ Qualified Sales Opportunities & 3.5x ROAS"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Marketing Channels Multiselect */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
            Target Channels & Platforms
          </label>
          <div className="flex flex-wrap gap-2">
            {availableChannels.map((ch) => {
              const selected = channels.includes(ch);
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => toggleChannel(ch)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selected
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:bg-slate-700'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${selected ? 'bg-indigo-400' : 'bg-slate-500'}`} />
                  <span>{ch}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generation Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Synthesizing Strategy Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Full Marketing Strategy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Strategy View */}
      {generatedStrategy && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Action Toolbar */}
          <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold text-white">{generatedStrategy.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Save className="h-3.5 w-3.5 text-indigo-400" />
                <span>Save Blueprint</span>
              </button>

              <button
                onClick={handleConvertToCampaign}
                disabled={isConverted}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold text-white shadow-lg transition-all ${
                  isConverted
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                }`}
              >
                {isConverted ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Converted & Scheduled!</span>
                  </>
                ) : (
                  <>
                    <CalendarPlus className="h-3.5 w-3.5" />
                    <span>Convert to Live Campaign & Calendar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 14 Structured Strategy Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Executive Summary */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <span>1. Executive Campaign Summary</span>
                </h4>
                <button
                  onClick={() => handleRegenerateSection('executiveSummary')}
                  disabled={regeneratingSection === 'executiveSummary'}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${regeneratingSection === 'executiveSummary' ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {generatedStrategy.sections.executiveSummary}
              </p>
            </div>

            {/* 2. Target Audience Analysis */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  2. Target Audience Analysis
                </h4>
                <button
                  onClick={() => handleRegenerateSection('targetAudienceAnalysis')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {generatedStrategy.sections.targetAudienceAnalysis}
              </p>
            </div>

            {/* 3. Customer Pain Points */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  3. Key Customer Pain Points
                </h4>
                <button
                  onClick={() => handleRegenerateSection('customerPainPoints')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              </div>
              <ul className="space-y-1.5">
                {generatedStrategy.sections.customerPainPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-rose-400 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Marketing Positioning */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  4. Uncontested Market Positioning
                </h4>
                <button
                  onClick={() => handleRegenerateSection('marketingPositioning')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {generatedStrategy.sections.marketingPositioning}
              </p>
            </div>

            {/* 5. Core Campaign Message */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  5. Core Single-Minded Message
                </h4>
                <button
                  onClick={() => handleRegenerateSection('coreCampaignMessage')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs font-bold text-indigo-200 italic">
                "{generatedStrategy.sections.coreCampaignMessage}"
              </div>
            </div>

            {/* 6. Content Pillars */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  6. Core Content Pillars
                </h4>
                <button
                  onClick={() => handleRegenerateSection('contentPillars')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {generatedStrategy.sections.contentPillars.map((pillar, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3">
                    <div className="text-xs font-bold text-white mb-1">{pillar.title}</div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">{pillar.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Suggested Formats & 8. Channel Recommendations */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  7. Channel-Specific Tactics
                </h4>
              </div>
              <div className="space-y-2">
                {generatedStrategy.sections.channelRecommendations.map((cr, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{cr.channel}</span>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {cr.frequency}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{cr.strategy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. Suggested KPIs */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  8. Target KPIs & Benchmarks
                </h4>
              </div>
              <div className="space-y-2">
                {generatedStrategy.sections.suggestedKPIs.map((kpi, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40 text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-emerald-400">{kpi.metric}</span>
                      <span className="text-[11px] font-semibold text-white">{kpi.target}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{kpi.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. Posting Schedule Blueprint */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  9. Tactical Posting Schedule & Cadence
                </h4>
                <span className="text-xs text-slate-400">
                  Ready to be populated into Content Calendar
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Day / Phase</th>
                      <th className="p-2.5">Channel</th>
                      <th className="p-2.5">Post Concept</th>
                      <th className="p-2.5 rounded-r-lg">Call to Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {generatedStrategy.sections.postingSchedule.map((sched, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-indigo-300 whitespace-nowrap">{sched.dayOrWeek}</td>
                        <td className="p-2.5 font-medium text-white">{sched.channel}</td>
                        <td className="p-2.5 text-slate-300">{sched.concept}</td>
                        <td className="p-2.5 text-emerald-400 font-medium">{sched.cta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 11. Suggested Experiments & 12. Optimization Recommendations */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                10. High-ROI Growth Experiments
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {generatedStrategy.sections.suggestedExperiments.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">🧪</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                11. Campaign Optimization Playbook
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {generatedStrategy.sections.optimizationRecommendations.map((opt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">📈</span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
