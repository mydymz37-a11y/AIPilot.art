import React, { useState } from 'react';
import {
  CreditCard,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  Gift,
  HelpCircle,
  TrendingUp,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanType } from '../../types';

export const UsageCreditsView: React.FC = () => {
  const {
    currentPlan,
    setCurrentPlan,
    creditsUsed,
    creditsLimit,
    brands,
    campaigns,
    showToast,
  } = useApp();

  const [appSumoCode, setAppSumoCode] = useState('');
  const [redeemedTier, setRedeemedTier] = useState<string | null>(null);

  const plans: {
    id: PlanType;
    name: string;
    price: string;
    billing: string;
    credits: number;
    brandsLimit: number;
    features: string[];
    popular?: boolean;
  }[] = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '$0',
      billing: 'Forever Free',
      credits: 50,
      brandsLimit: 1,
      features: [
        '50 AI Credits / month',
        '1 Brand Business Brain',
        '3 Active Campaigns',
        'Standard Content Studio',
        'Internal Content Calendar',
      ],
    },
    {
      id: 'starter',
      name: 'Starter Pro',
      price: '$29',
      billing: 'per month',
      credits: 200,
      brandsLimit: 3,
      features: [
        '200 AI Credits / month',
        '3 Brand Profiles',
        'Unlimited Active Campaigns',
        'One-to-Many Repurposing Engine',
        'Creative Studio & Prompts',
        'Competitor Intelligence (5 max)',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$79',
      billing: 'per month',
      credits: 500,
      brandsLimit: 10,
      popular: true,
      features: [
        '500 AI Credits / month',
        '10 Brand Profiles',
        'Full AI Growth Analyst & Telemetry',
        'AI Marketing Autopilot Pipelines',
        'Editorial Approvals & Review Comments',
        'Full CSV Export & Import',
        'Priority Gemini Flash AI Processing',
      ],
    },
    {
      id: 'agency',
      name: 'Agency Scale',
      price: '$199',
      billing: 'per month',
      credits: 2000,
      brandsLimit: 50,
      features: [
        '2,000 AI Credits / month',
        '50 Client Brand Portfolios',
        'Multi-Client RBAC Access Control',
        'White-label Strategy Reports (PDF)',
        'Unlimited Team Seats & Client Viewers',
        'Custom Workflow Automation Engine',
      ],
    },
  ];

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = appSumoCode.trim().toUpperCase();
    if (!clean) {
      showToast('Please enter an AppSumo redemption code.', 'warning');
      return;
    }

    if (clean.startsWith('TIER3') || clean.includes('AGENCY')) {
      setCurrentPlan('agency');
      setRedeemedTier('AppSumo Tier 3 (Agency Lifetime)');
      showToast('Redeemed AppSumo Tier 3: Upgraded to Agency License!', 'success');
    } else if (clean.startsWith('TIER2') || clean.includes('PRO')) {
      setCurrentPlan('pro');
      setRedeemedTier('AppSumo Tier 2 (Pro Lifetime)');
      showToast('Redeemed AppSumo Tier 2: Upgraded to Professional Plan!', 'success');
    } else {
      setCurrentPlan('starter');
      setRedeemedTier('AppSumo Tier 1 (Starter Lifetime)');
      showToast('Redeemed AppSumo Tier 1: Upgraded to Starter Plan!', 'success');
    }
    setAppSumoCode('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Account: Usage, Licensing & AppSumo Entitlements</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Usage & Quotas</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Monitor real-time AI generation credits, brand allowances, and active tier entitlements.
          </p>
        </div>

        <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 px-4 py-2 text-right">
          <div className="text-[11px] text-slate-400">Current Active Plan:</div>
          <div className="text-sm font-extrabold text-indigo-400 uppercase tracking-wide">
            {currentPlan}
          </div>
        </div>
      </div>

      {/* Credit & Quota Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* AI Generations */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">AI Generation Credits</span>
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {creditsUsed} <span className="text-sm font-normal text-slate-400">/ {creditsLimit}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (creditsUsed / creditsLimit) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>{creditsLimit - creditsUsed} available</span>
            <span>Resets on 1st of month</span>
          </div>
        </div>

        {/* Brands Limit */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Active Brand Profiles</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {brands.length} <span className="text-sm font-normal text-slate-400">/ 10 max</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${Math.min(100, (brands.length / 10) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">
            {10 - brands.length} brand slots remaining in current workspace
          </div>
        </div>

        {/* Campaign Limit */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Active Campaigns</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {campaigns.length} <span className="text-sm font-normal text-slate-400">/ Unlimited</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            Unlimited campaigns enabled on Pro tier
          </div>
        </div>
      </div>

      {/* AppSumo Redemption Box */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Gift className="h-4 w-4" />
          <span>AppSumo Lifetime Deal Activation</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white">
              Have an AppSumo Redemption Code?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Enter your code (e.g. <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-cyan-300">TIER2-LIFETIME</code> or <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-cyan-300">TIER3-AGENCY</code>) to simulate license tier activation.
            </p>
          </div>

          <form onSubmit={handleRedeemCode} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={appSumoCode}
              onChange={(e) => setAppSumoCode(e.target.value)}
              placeholder="e.g. TIER2-AIPILOT"
              className="rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-colors whitespace-nowrap"
            >
              Activate License
            </button>
          </form>
        </div>

        {redeemedTier && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Active License: <strong>{redeemedTier}</strong></span>
          </div>
        )}
      </div>

      {/* Plan Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white">SaaS Plans & Entitlements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p) => {
            const isSelected = currentPlan === p.id;

            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  p.popular
                    ? 'bg-slate-900 border-indigo-500 shadow-2xl ring-1 ring-indigo-500/40 relative'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md">
                    Most Popular
                  </span>
                )}

                <div>
                  <h4 className="text-base font-bold text-white mb-1">{p.name}</h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-white">{p.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/ {p.billing}</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4 mb-6">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentPlan(p.id);
                    showToast(`Switched active entitlement tier to "${p.name}"`, 'success');
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : p.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isSelected ? 'Current Active Tier' : `Select ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
