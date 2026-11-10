import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Copy,
  Check,
  Plus,
  Trash2,
  Layers,
  Video,
  FileText,
  Type,
  Layout,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CreativeAsset } from '../../types';

export const CreativeStudioView: React.FC = () => {
  const {
    activeBrand,
    creativeAssets,
    createCreativeAsset,
    deleteCreativeAsset,
    consumeCredit,
    showToast,
    setCurrentView,
  } = useApp();

  const [selectedType, setSelectedType] = useState<
    'image_prompt' | 'concept' | 'ad_concept' | 'video_script' | 'headline_pack' | 'design_brief'
  >('image_prompt');
  const [campaignGoal, setCampaignGoal] = useState('High-Conversion Enterprise Inbound');
  const [productFeatures, setProductFeatures] = useState(
    activeBrand?.usp || 'Predictive RevOps Intelligence & Deal Alert Cockpit'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateCreative = async () => {
    if (!consumeCredit(3)) return;

    setIsGenerating(true);
    showToast('AI Creative Studio is synthesizing visual directions and prompts...', 'info');

    try {
      const res = await fetch('/api/ai/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: activeBrand,
          creativeType: selectedType,
          campaignGoal,
          productFeatures,
        }),
      });

      const data = await res.json();
      if (data.success && data.asset) {
        createCreativeAsset({
          brandId: activeBrand?.id || 'brand-1',
          title: data.asset.title,
          type: selectedType,
          content: data.asset.content,
          visualDirection: data.asset.visualDirection,
          dimensions: data.asset.dimensions || '16:9',
          tags: data.asset.tags || ['creative', selectedType],
        });
        showToast('Creative asset generated and added to library!', 'success');
      }
    } catch {
      showToast('Creative generation encountered an error.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied creative asset to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const brandCreatives = creativeAssets.filter(
    (c) => !activeBrand || c.brandId === activeBrand.id
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Module 7: Visual Creative Studio & Art Direction</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">AI Creative Studio</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Generate production-ready image prompts (Midjourney / DALL-E / Imagen), high-converting ad headlines, video storyboards, and design briefs.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('media_library')}
          className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors"
        >
          <ImageIcon className="h-4 w-4 text-indigo-400" />
          <span>Open Media Library</span>
        </button>
      </div>

      {/* Generator Controls */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>Creative Brief Directive</span>
        </h3>

        {/* Type Selector Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Asset Type to Generate
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'image_prompt', label: 'Image Prompt', icon: ImageIcon },
              { id: 'ad_concept', label: 'Ad Concept', icon: Layout },
              { id: 'headline_pack', label: 'Headlines', icon: Type },
              { id: 'video_script', label: 'Video Script', icon: Video },
              { id: 'concept', label: 'Visual Metaphor', icon: Sparkles },
              { id: 'design_brief', label: 'Design Brief', icon: FileText },
            ].map((t) => {
              const active = selectedType === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id as any)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Campaign Objective / Angle
            </label>
            <input
              type="text"
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              placeholder="e.g. Stop deal leakage, highlight 7-day velocity"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Focus / Core Feature
            </label>
            <input
              type="text"
              value={productFeatures}
              onChange={(e) => setProductFeatures(e.target.value)}
              placeholder="e.g. Autonomous forecasting dashboard"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerateCreative}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Crafting Visual Assets...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Creative Direction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Creative Asset Library */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <span>Saved Brand Creative Assets & Prompts ({brandCreatives.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {brandCreatives.map((asset) => {
            const isCopied = copiedId === asset.id;
            return (
              <div
                key={asset.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {asset.type.replace('_', ' ')}
                      </span>
                      {asset.dimensions && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {asset.dimensions}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyContent(asset.content, asset.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px] font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteCreativeAsset(asset.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400"
                        title="Delete Asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">{asset.title}</h4>

                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-200 whitespace-pre-line leading-relaxed mb-3 font-mono text-[11px]">
                    {asset.content}
                  </div>

                  {asset.visualDirection && (
                    <div className="text-xs text-slate-400 mb-3">
                      <strong className="text-slate-300">Styling & Art Direction: </strong>
                      {asset.visualDirection}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-1">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
