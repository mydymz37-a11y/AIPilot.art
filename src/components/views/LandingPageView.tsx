import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Megaphone,
  Repeat,
  TrendingUp,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Check,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPageView: React.FC = () => {
  const { currentView, setCurrentView, currentUser, setIsAuthModalOpen, setAuthModalMode } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              AIPilot<span className="text-indigo-400">.art</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#comparison" className="hover:text-white transition-colors">Why AIPilot</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Dashboard ({currentUser.name.split(' ')[0]})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="rounded-xl px-3 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#0B0F19] to-[#0B0F19] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>The AI Social Campaign & Marketing Operations Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Your Entire Marketing Department, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
              Powered by AI.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            Plan campaigns, create better content, manage your marketing workflow, and turn performance data into smarter growth decisions — all in one intelligent workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentView('onboarding')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/40 transition-all hover:scale-[1.02]"
            >
              <span>Start Creating for Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-200 transition-colors"
            >
              Explore the Platform
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Full Brand Brain Persistence</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>1-Idea to 7-Platform Repurposing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Mathematical CAC & ROAS Telemetry</span>
            </span>
          </div>
        </div>

        {/* Live Interactive Product Preview Card */}
        <div className="mt-12 max-w-5xl mx-auto rounded-2xl bg-slate-900 border border-slate-700/80 p-4 sm:p-6 shadow-2xl shadow-indigo-950/50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-400">app.aipilot.art/command-center</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              LIVE COCKPIT PREVIEW
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50 text-left">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Step 1: AI Marketing Director
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Autonomous 30-Day Strategy</h4>
              <p className="text-xs text-slate-300">
                14-point tactical blueprint formulated with target KPIs, content pillars, and posting schedule.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50 text-left">
              <div className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">
                Step 2: One-to-Many Engine
              </div>
              <h4 className="text-sm font-bold text-white mb-1">7-Platform Rollout Package</h4>
              <p className="text-xs text-slate-300">
                1 master insight converted into native Instagram, LinkedIn, TikTok, X, and YouTube scripts.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50 text-left">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                Step 3: AI Growth Analyst
              </div>
              <h4 className="text-sm font-bold text-white mb-1">ROAS & CPA Telemetry</h4>
              <p className="text-xs text-slate-300">
                Mathematical optimization diagnosing drop-offs and reallocating ad budget to top performers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Why AIPilot.art */}
      <section id="comparison" className="py-20 px-6 border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Strategic Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Why High-Growth Teams Choose AIPilot.art
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              How AIPilot.art replaces fragmented point solutions with a single continuous operational workflow.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-2xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-4">Operational Capability</th>
                  <th className="p-4 text-slate-400">Traditional Agency</th>
                  <th className="p-4 text-slate-400">Basic AI Copy Tools</th>
                  <th className="p-4 bg-indigo-600/10 text-indigo-300 border-l border-r border-indigo-500/30">
                    AIPilot.art
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                <tr>
                  <td className="p-4 font-bold text-white">Continuous Brand Intelligence</td>
                  <td className="p-4 text-slate-400">Briefing calls & PDFs</td>
                  <td className="p-4 text-rose-400">None (Re-type every prompt)</td>
                  <td className="p-4 font-bold text-emerald-400 bg-indigo-600/5 border-l border-r border-indigo-500/30">
                    Persistent Business Brain
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Tactical 30-Day Strategy</td>
                  <td className="p-4 text-slate-400">Takes 2-3 weeks</td>
                  <td className="p-4 text-rose-400">Not supported</td>
                  <td className="p-4 font-bold text-emerald-400 bg-indigo-600/5 border-l border-r border-indigo-500/30">
                    Instant 14-point structured plan
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Omnichannel Repurposing</td>
                  <td className="p-4 text-slate-400">Manual re-writing</td>
                  <td className="p-4 text-slate-400">One prompt at a time</td>
                  <td className="p-4 font-bold text-emerald-400 bg-indigo-600/5 border-l border-r border-indigo-500/30">
                    1 Idea → 7 Synchronized Platforms
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Mathematical ROAS / CPA Telemetry</td>
                  <td className="p-4 text-slate-400">Monthly delayed reports</td>
                  <td className="p-4 text-rose-400">Zero performance tracking</td>
                  <td className="p-4 font-bold text-emerald-400 bg-indigo-600/5 border-l border-r border-indigo-500/30">
                    Live Telemetry + AI Growth Analyst
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Cost & Retainers</td>
                  <td className="p-4 text-rose-400">$6,000 - $15,000 / month</td>
                  <td className="p-4 text-slate-400">$49/mo (Fragmented tools)</td>
                  <td className="p-4 font-bold text-emerald-400 bg-indigo-600/5 border-l border-r border-indigo-500/30">
                    From $0 to $79 / month
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Plans for Founders, Growth Teams & Agencies
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Start free. Upgrade as your campaigns scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Free Trial</h3>
                <div className="my-4">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400"> / forever free</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>50 AI Credits per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>1 Active Brand Brain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>Internal Content Calendar</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl bg-slate-900 border border-indigo-500 p-6 flex flex-col justify-between shadow-2xl ring-1 ring-indigo-500/40 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-extrabold text-white uppercase">
                Most Popular
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Professional</h3>
                <div className="my-4">
                  <span className="text-3xl font-black text-white">$79</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>500 AI Credits per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>10 Brand Profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>One-to-Many Repurposing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Full AI Growth Analyst & Telemetry</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
              >
                Start Professional
              </button>
            </div>

            {/* Agency */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Agency Scale</h3>
                <div className="my-4">
                  <span className="text-3xl font-black text-white">$199</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>2,000 AI Credits per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>50 Client Brand Portfolios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>Client Approvals & RBAC Roles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>White-label PDF Reports</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                Scale Your Agency
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 bg-[#0B0F19] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="font-bold text-white">AIPilot.art</span>
            <span>— Your AI Marketing Department.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-white">
              Launch App
            </button>
            <button onClick={() => setCurrentView('help_support')} className="hover:text-white">
              Knowledge Base
            </button>
            <button onClick={() => setCurrentView('settings')} className="hover:text-white">
              Settings & Privacy
            </button>
          </div>

          <div>
            © 2026 AIPilot.art. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
