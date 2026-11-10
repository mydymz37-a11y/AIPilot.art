import React, { useState } from 'react';
import {
  BrainCircuit,
  Plus,
  Copy,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Tag,
  ShieldAlert,
  Target,
  Palette,
  FileText,
  Volume2,
  Globe,
  X,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandProfile } from '../../types';

export const BrandIntelligenceView: React.FC = () => {
  const {
    brands,
    activeBrand,
    activeBrandId,
    switchBrand,
    createBrand,
    updateBrand,
    duplicateBrand,
    deleteBrand,
    currentUserRole,
    showToast,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandProfile | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<BrandProfile | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [productsServices, setProductsServices] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [targetCountries, setTargetCountries] = useState('United States, UK, Canada');
  const [customerProblems, setCustomerProblems] = useState('');
  const [usp, setUsp] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [brandVoice, setBrandVoice] = useState('Authoritative, Clear, Visionary');
  const [preferredLanguages, setPreferredLanguages] = useState('English (US)');
  const [colorPrimary, setColorPrimary] = useState('#0F172A');
  const [colorSecondary, setColorSecondary] = useState('#4F46E5');
  const [colorAccent, setColorAccent] = useState('#06B6D4');
  const [writingStyle, setWritingStyle] = useState('Data-backed declarative sentences with zero fluff.');
  const [prohibitedWords, setProhibitedWords] = useState('cheap, guru, magic, synergy');
  const [preferredCTAs, setPreferredCTAs] = useState('Book an Executive Briefing, Explore Live Interactive Tour');
  const [marketingGoals, setMarketingGoals] = useState('Scale pipeline by 40%, Reduce customer acquisition cost');

  const openCreateModal = () => {
    setEditingBrand(null);
    setName('');
    setWebsite('https://');
    setIndustry('SaaS & Digital Technology');
    setDescription('');
    setProductsServices('');
    setTargetAudience('');
    setTargetCountries('United States, UK, Canada');
    setCustomerProblems('');
    setUsp('');
    setCompetitors('');
    setBrandVoice('Authoritative, Visionary & Pragmatic');
    setPreferredLanguages('English (US)');
    setColorPrimary('#0F172A');
    setColorSecondary('#4F46E5');
    setColorAccent('#06B6D4');
    setWritingStyle('Concise, punchy, high-leverage tone with proof points.');
    setProhibitedWords('cheap, guru, magic, synergy');
    setPreferredCTAs('Get Started Free, Schedule Private Strategy Session');
    setMarketingGoals('Grow qualified pipeline, Improve conversion rates');
    setModalOpen(true);
  };

  const openEditModal = (b: BrandProfile) => {
    setEditingBrand(b);
    setName(b.name);
    setWebsite(b.website);
    setIndustry(b.industry);
    setDescription(b.description);
    setProductsServices(b.productsServices);
    setTargetAudience(b.targetAudience);
    setTargetCountries(b.targetCountries.join(', '));
    setCustomerProblems(b.customerProblems);
    setUsp(b.usp);
    setCompetitors(b.competitors.join(', '));
    setBrandVoice(b.brandVoice);
    setPreferredLanguages(b.preferredLanguages.join(', '));
    setColorPrimary(b.brandColors?.primary || '#0F172A');
    setColorSecondary(b.brandColors?.secondary || '#4F46E5');
    setColorAccent(b.brandColors?.accent || '#06B6D4');
    setWritingStyle(b.writingStyle);
    setProhibitedWords((b.prohibitedWords || []).join(', '));
    setPreferredCTAs((b.preferredCTAs || []).join(', '));
    setMarketingGoals((b.marketingGoals || []).join(', '));
    setModalOpen(true);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a business name.', 'warning');
      return;
    }

    const payload = {
      name,
      website,
      industry,
      description,
      productsServices,
      targetAudience,
      targetCountries: targetCountries.split(',').map((s) => s.trim()).filter(Boolean),
      customerProblems,
      usp,
      competitors: competitors.split(',').map((s) => s.trim()).filter(Boolean),
      brandVoice,
      preferredLanguages: preferredLanguages.split(',').map((s) => s.trim()).filter(Boolean),
      brandColors: {
        primary: colorPrimary,
        secondary: colorSecondary,
        accent: colorAccent,
      },
      writingStyle,
      prohibitedWords: prohibitedWords.split(',').map((s) => s.trim()).filter(Boolean),
      preferredCTAs: preferredCTAs.split(',').map((s) => s.trim()).filter(Boolean),
      marketingGoals: marketingGoals.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (editingBrand) {
      updateBrand(editingBrand.id, payload);
    } else {
      createBrand(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/50 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Module 1: AI Business Brain</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Brand Intelligence System</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your centralized marketing brain. Information entered here is persistently stored and automatically supplied as deep contextual intelligence across all AI modules.
          </p>
        </div>

        {currentUserRole !== 'viewer' && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Brand</span>
          </button>
        )}
      </div>

      {/* Brands List / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {brands.map((b) => {
          const isActive = b.id === activeBrandId;
          return (
            <div
              key={b.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/30 shadow-xl'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
                      style={{
                        backgroundColor: b.brandColors?.accent || '#6366F1',
                      }}
                    >
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-white">{b.name}</h3>
                        {isActive && (
                          <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                            Active Context
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{b.industry}</span>
                        {b.website && (
                          <>
                            <span>•</span>
                            <a
                              href={b.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:underline flex items-center gap-0.5"
                            >
                              <span>{b.website.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateBrand(b.id)}
                      title="Duplicate Brand"
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {currentUserRole !== 'viewer' && (
                      <>
                        <button
                          onClick={() => openEditModal(b)}
                          title="Edit Brand"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(b)}
                          title="Delete Brand"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Description & USP */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {b.description}
                </p>

                {/* Highlight Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>Unique Selling Proposition</span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-3">{b.usp}</p>
                  </div>

                  <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
                      <Volume2 className="h-3 w-3" />
                      <span>Brand Voice & Style</span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-3">{b.brandVoice}</p>
                  </div>
                </div>

                {/* Target Audience & Problems */}
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-400 min-w-[110px]">Target Audience:</span>
                    <span className="text-slate-300">{b.targetAudience}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-400 min-w-[110px]">Customer Pains:</span>
                    <span className="text-slate-300 line-clamp-2">{b.customerProblems}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-400 min-w-[110px]">Brand Colors:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-4 w-4 rounded-full border border-white/20"
                        style={{ backgroundColor: b.brandColors?.primary }}
                        title="Primary"
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-white/20"
                        style={{ backgroundColor: b.brandColors?.secondary }}
                        title="Secondary"
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-white/20"
                        style={{ backgroundColor: b.brandColors?.accent }}
                        title="Accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Switch Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {b.marketingGoals?.length || 0} Marketing Goals Defined
                </span>
                {!isActive ? (
                  <button
                    onClick={() => switchBrand(b.id)}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-indigo-400 border border-slate-700 transition-colors"
                  >
                    Select as Active Brand
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Injected Into AI Context</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {editingBrand ? `Edit Brand: ${editingBrand.name}` : 'Create Brand Intelligence Profile'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Business / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. NexusFlow Analytics"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. B2B Enterprise SaaS / E-commerce"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Geography / Countries
                  </label>
                  <input
                    type="text"
                    value={targetCountries}
                    onChange={(e) => setTargetCountries(e.target.value)}
                    placeholder="e.g. US, UK, Canada, Australia"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what your company does in 2-3 clear sentences..."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Products and Services
                </label>
                <input
                  type="text"
                  value={productsServices}
                  onChange={(e) => setProductsServices(e.target.value)}
                  placeholder="e.g. NexusFlow Core Suite, Forecasting Engine, Alerts"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. CROs, Sales Leaders, Tech Founders"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Competitors (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    placeholder="e.g. Clari, Gong, Aviso"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer Problems Solved
                </label>
                <textarea
                  rows={2}
                  value={customerProblems}
                  onChange={(e) => setCustomerProblems(e.target.value)}
                  placeholder="What painful friction or loss does the customer experience without your product?"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Unique Selling Proposition (USP)
                </label>
                <input
                  type="text"
                  value={usp}
                  onChange={(e) => setUsp(e.target.value)}
                  placeholder="Why choose your brand over any alternative?"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Voice</label>
                  <input
                    type="text"
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                    placeholder="e.g. Authoritative, Witty, Conversational, Elegant"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Writing Style
                  </label>
                  <input
                    type="text"
                    value={writingStyle}
                    onChange={(e) => setWritingStyle(e.target.value)}
                    placeholder="e.g. Punchy sentences, data-driven, zero fluff"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Brand Colors */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Colors</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Primary Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colorPrimary}
                        onChange={(e) => setColorPrimary(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={colorPrimary}
                        onChange={(e) => setColorPrimary(e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-xs text-white uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Secondary</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colorSecondary}
                        onChange={(e) => setColorSecondary(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={colorSecondary}
                        onChange={(e) => setColorSecondary(e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-xs text-white uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Accent</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colorAccent}
                        onChange={(e) => setColorAccent(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={colorAccent}
                        onChange={(e) => setColorAccent(e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-xs text-white uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Prohibited Words (Excluded from AI Copy)
                </label>
                <input
                  type="text"
                  value={prohibitedWords}
                  onChange={(e) => setProhibitedWords(e.target.value)}
                  placeholder="e.g. cheap, guru, magic, synergy"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Calls to Action (CTAs)
                </label>
                <input
                  type="text"
                  value={preferredCTAs}
                  onChange={(e) => setPreferredCTAs(e.target.value)}
                  placeholder="e.g. Book an Executive Briefing, Claim Free Audit"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Marketing Goals
                </label>
                <input
                  type="text"
                  value={marketingGoals}
                  onChange={(e) => setMarketingGoals(e.target.value)}
                  placeholder="e.g. Scale pipeline 40%, Reduce customer acquisition cost"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  {editingBrand ? 'Save Changes' : 'Create Brand Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete Brand Profile?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you sure you want to delete <strong className="text-white">"{deleteCandidate.name}"</strong>?
              This will remove all associated brand parameters and voice profiles.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteBrand(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
