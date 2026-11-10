import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Target,
  Briefcase,
  Compass,
  CheckCircle2,
  Layers,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingView: React.FC = () => {
  const { createBrand, setCurrentView, showToast, saveStrategy } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [businessType, setBusinessType] = useState('B2B SaaS');
  const [brandName, setBrandName] = useState('AeroScale Operations');
  const [website, setWebsite] = useState('https://aeroscale.io');
  const [description, setDescription] = useState(
    'Autonomous logistics operations software that optimizes fleet routing in real-time.'
  );
  const [usp, setUsp] = useState('Guaranteed 18% fuel reduction in 14 days without hardware retrofits.');
  const [targetAudience, setTargetAudience] = useState('Fleet Directors and VP of Supply Chain');
  const [customerProblem, setCustomerProblem] = useState('Volatile fuel costs and fragmented dispatcher communication.');
  const [marketingObjective, setMarketingObjective] = useState('Lead Generation');
  const [platforms, setPlatforms] = useState<string[]>(['LinkedIn', 'X']);
  const [isFinishing, setIsFinishing] = useState(false);

  const businessTypes = [
    { id: 'B2B SaaS', label: 'B2B Software & SaaS', desc: 'Subscription tech, developer tools, enterprise solutions' },
    { id: 'E-Commerce', label: 'D2C & E-Commerce', desc: 'Online storefronts, physical products, apparel & lifestyle' },
    { id: 'Agency', label: 'Marketing Agency', desc: 'Managing campaigns and multiple brand accounts for clients' },
    { id: 'Creator', label: 'Creator & Info Products', desc: 'Newsletters, online courses, podcasts, digital downloads' },
    { id: 'Services', label: 'Professional Services', desc: 'Consulting, legal, architecture, financial advisory' },
  ];

  const objectives = [
    'Brand Awareness',
    'Lead Generation',
    'Product Sales',
    'Customer Retention',
    'Product Launch',
    'Website Traffic',
  ];

  const availablePlatforms = ['LinkedIn', 'X', 'Instagram', 'TikTok', 'YouTube', 'Facebook'];

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) setPlatforms(platforms.filter((x) => x !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleFinishOnboarding = () => {
    setIsFinishing(true);
    showToast('Setting up your AI Business Brain and initial strategy...', 'info');

    // Create the brand
    const newBrand = createBrand({
      name: brandName,
      website,
      industry: businessType,
      description,
      productsServices: `${brandName} Core Platform`,
      targetAudience,
      targetCountries: ['United States', 'United Kingdom', 'Canada'],
      customerProblems: customerProblem,
      usp,
      competitors: ['Legacy Competitor A', 'Point Solution B'],
      brandVoice: 'Authoritative, Clear, Pragmatic',
      preferredLanguages: ['English (US)'],
      brandColors: {
        primary: '#0F172A',
        secondary: '#4F46E5',
        accent: '#06B6D4',
      },
      writingStyle: 'Direct and quantified value delivery.',
      prohibitedWords: ['cheap', 'guru', 'magic'],
      preferredCTAs: ['Schedule Executive Briefing', 'Claim Free Benchmark'],
      marketingGoals: ['Scale qualified sales pipeline', 'Lower cost per acquisition'],
    });

    // Auto-generate initial strategy
    saveStrategy({
      id: `strat-${Date.now()}`,
      brandId: newBrand.id,
      title: `${marketingObjective} Master Strategy — ${brandName}`,
      objective: marketingObjective,
      productOrService: `${brandName} Core Suite`,
      targetAudience,
      targetCountry: 'United States',
      channels: platforms,
      durationDays: 30,
      budget: '$2,500',
      offerPromotion: 'Complimentary Logistics Diagnostic',
      desiredOutcome: '30+ Qualified Executive Sales Demos',
      sections: {
        executiveSummary: `The "${marketingObjective}" initiative for ${brandName} positions the company as the premier logistics intelligence provider, eliminating ${customerProblem}.`,
        targetAudienceAnalysis: `Targeting growth-focused decision makers in supply chain operations who need quantifiable ROI.`,
        customerPainPoints: [
          customerProblem,
          'Unpredictable operational margins and communication friction',
          'Lack of real-time telemetry across decentralized teams',
        ],
        marketingPositioning: `Position ${brandName} as the high-velocity modern solution that delivers 18% fuel reduction in 14 days.`,
        coreCampaignMessage: `Stop flying blind on logistics costs: Discover predictable operational certainty.`,
        contentPillars: [
          { title: 'The Hidden Fleet Leak', description: 'Deconstructing invisible fuel waste and driver idle time.' },
          { title: 'The 14-Day Shift', description: 'Case study demonstrating immediate software integration.' },
        ],
        campaignThemes: ['Velocity Over Friction', 'Predictable Margins'],
        channelRecommendations: platforms.map((c) => ({
          channel: c,
          strategy: 'Native thought leadership and data breakdowns',
          frequency: '3x weekly',
        })),
        suggestedFormats: ['Data teardown carousels', 'Short video demonstrations', 'Benchmark reports'],
        postingSchedule: [
          { dayOrWeek: 'Day 1', channel: platforms[0] || 'LinkedIn', concept: 'The fuel cost trap holding fleets back', cta: 'Check our benchmark' },
          { dayOrWeek: 'Day 4', channel: platforms[1] || 'X', concept: '5 counter-intuitive rules of fleet routing', cta: 'Read the full thread' },
        ],
        callsToAction: ['Schedule Executive Briefing', 'Download Free Fuel Benchmark'],
        suggestedKPIs: [
          { metric: 'Qualified Demos', target: '30+ target accounts', rationale: 'Direct pipeline signal' },
          { metric: 'CPA', target: '< $120', rationale: 'Sustainable unit economics' },
        ],
        suggestedExperiments: ['Direct value prop vs Pain avoidance hook'],
        optimizationRecommendations: ['Reallocate 30% of spend into top converting channel after 72 hours'],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    showToast('Onboarding complete! Your AI Marketing Department is ready.', 'success');
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-between p-6">
      <div className="max-w-2xl mx-auto w-full pt-8 pb-12 space-y-8">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-sm">AIPilot.art Onboarding</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Step {step} of 7</span>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-300 ml-4 font-semibold"
            >
              Skip Setup →
            </button>
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 inline-block">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Welcome to AIPilot.art
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              In the next 2 minutes, we will configure your <strong>AI Business Brain</strong>, formulate your first customized 30-day marketing strategy, and prepare your omnichannel content calendar.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero generic prompts — all outputs adapt to your real business</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Automatic 1-idea to 7-platform cross-distribution</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Live mathematical ROAS & CPA performance telemetry</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Business Type */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              What type of business are you scaling?
            </h2>
            <p className="text-xs text-slate-400">
              This helps calibrate the tone, channel recommendations, and strategic pillars.
            </p>

            <div className="space-y-2.5">
              {businessTypes.map((bt) => (
                <button
                  key={bt.id}
                  onClick={() => setBusinessType(bt.id)}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${
                    businessType === bt.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-sm">{bt.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{bt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Enter Brand Details */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-xs">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Tell us about your brand
            </h2>
            <p className="text-slate-400">
              The AI uses these parameters as its foundational knowledge base.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">What does your company do?</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Unique Selling Proposition (USP)</label>
                <input
                  type="text"
                  value={usp}
                  onChange={(e) => setUsp(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Audience & Pain Points */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300 text-xs">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Who are you selling to?
            </h2>
            <p className="text-slate-400">
              High-converting copy always attacks specific customer pain points.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Customer Persona</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Sales Directors, Busy Founders, Interior Designers"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary Customer Pain Point</label>
                <textarea
                  rows={3}
                  value={customerProblem}
                  onChange={(e) => setCustomerProblem(e.target.value)}
                  placeholder="What is keeping them up at night? What does inaction cost them?"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Marketing Objective */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              What is your primary marketing goal?
            </h2>
            <p className="text-xs text-slate-400">
              Select the initial outcome for your first campaign strategy.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {objectives.map((obj) => (
                <button
                  key={obj}
                  onClick={() => setMarketingObjective(obj)}
                  className={`p-4 rounded-xl text-left border text-xs font-bold transition-all ${
                    marketingObjective === obj
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Social Platforms */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Where does your audience spend time?
            </h2>
            <p className="text-xs text-slate-400">
              Choose your focus channels for multi-platform distribution.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availablePlatforms.map((p) => {
                const isSelected = platforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>{p}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 7: Ready to Launch */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 inline-block">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Your AI Marketing Cockpit is Ready
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We have synthesized <strong>{brandName}</strong> with our core AI Business Brain. Clicking launch will generate your initial strategy, populate your Content Calendar, and initialize your dashboard.
            </p>

            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Configured Brand:</span>
                <span className="font-bold text-white">{brandName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Objective:</span>
                <span className="font-bold text-indigo-400">{marketingObjective}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Channels:</span>
                <span className="font-bold text-white">{platforms.join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishOnboarding}
              disabled={isFinishing}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 px-7 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Marketing Cockpit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
