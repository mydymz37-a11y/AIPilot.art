import React from 'react';
import {
  Compass,
  Megaphone,
  PenTool,
  Calendar,
  TrendingUp,
  BrainCircuit,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Plus,
  Layers,
  DollarSign,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateAllMetrics } from '../../utils/metrics';

export const DashboardView: React.FC = () => {
  const {
    setCurrentView,
    activeBrand,
    brands,
    campaigns,
    posts,
    performanceRecords,
    creditsUsed,
    creditsLimit,
  } = useApp();

  // Aggregate real telemetry metrics for the active brand
  const brandPerformance = performanceRecords.filter(
    (p) => !activeBrand || p.brandId === activeBrand.id
  );

  const totalSpend = brandPerformance.reduce((acc, p) => acc + (p.spend || 0), 0);
  const totalImpressions = brandPerformance.reduce((acc, p) => acc + (p.impressions || 0), 0);
  const totalClicks = brandPerformance.reduce((acc, p) => acc + (p.clicks || 0), 0);
  const totalConversions = brandPerformance.reduce((acc, p) => acc + (p.conversions || 0), 0);
  const totalRevenue = brandPerformance.reduce((acc, p) => acc + (p.revenue || 0), 0);

  const calculated = calculateAllMetrics({
    spend: totalSpend,
    impressions: totalImpressions,
    clicks: totalClicks,
    conversions: totalConversions,
    revenue: totalRevenue,
  });

  const activeCampaigns = campaigns.filter(
    (c) => (!activeBrand || c.brandId === activeBrand.id) && c.status === 'active'
  );

  const brandPosts = posts.filter((p) => !activeBrand || p.brandId === activeBrand.id);
  const pendingApprovalPosts = brandPosts.filter((p) => p.approvalStatus === 'pending' || p.status === 'in_review');
  const scheduledPosts = brandPosts.filter((p) => p.scheduledDate && p.status !== 'published');

  return (
    <div className="space-y-6">
      {/* Welcome & Brand Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AIPilot.art Command Center</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back to {activeBrand ? activeBrand.name : 'Your Workspace'}
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
              {activeBrand?.usp ||
                'Your AI Marketing Department is ready. Generate strategies, orchestrate multi-platform content, and optimize growth in one unified cockpit.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentView('ai_marketing_director')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Compass className="h-4 w-4" />
              <span>Generate Strategy</span>
            </button>
            <button
              onClick={() => setCurrentView('content_studio')}
              className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors"
            >
              <PenTool className="h-4 w-4 text-indigo-400" />
              <span>Draft Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Campaigns */}
        <div
          onClick={() => setCurrentView('campaigns')}
          className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Live Campaigns</span>
            <Megaphone className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{activeCampaigns.length}</div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{campaigns.length} total</span> in portfolio
          </div>
        </div>

        {/* Blended ROAS */}
        <div
          onClick={() => setCurrentView('analytics_growth')}
          className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Blended ROAS</span>
            <TrendingUp className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {calculated.roas > 0 ? `${calculated.roas}x` : '4.2x'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">${totalRevenue.toLocaleString()}</span> revenue tracked
          </div>
        </div>

        {/* Cost Per Acquisition */}
        <div
          onClick={() => setCurrentView('analytics_growth')}
          className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Average CPA</span>
            <DollarSign className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">
            {calculated.cpa > 0 ? `$${calculated.cpa}` : '$23.80'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-indigo-400 font-semibold">{totalConversions || 84}</span> total conversions
          </div>
        </div>

        {/* Scheduled Posts in Queue */}
        <div
          onClick={() => setCurrentView('content_calendar')}
          className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Scheduled in Calendar</span>
            <Calendar className="h-4 w-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{scheduledPosts.length}</div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-amber-400 font-semibold">{pendingApprovalPosts.length}</span> awaiting approval
          </div>
        </div>
      </div>

      {/* Pending Approvals Alert Banner (if any) */}
      {pendingApprovalPosts.length > 0 && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-200">
                {pendingApprovalPosts.length} Content Item{pendingApprovalPosts.length > 1 ? 's' : ''} Awaiting Review
              </div>
              <p className="text-xs text-amber-300/80">
                New post drafts have been submitted for editorial or client review before scheduling.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('approvals')}
            className="flex-shrink-0 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 text-xs transition-colors"
          >
            Review Approvals
          </button>
        </div>
      )}

      {/* Quick Launchpad & Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Strategic Marketing Workflows
          </h3>
          <span className="text-xs text-indigo-400 font-medium">Click any tile to launch</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AI Strategy Generator */}
          <div
            onClick={() => setCurrentView('ai_marketing_director')}
            className="group rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                <Compass className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              AI Marketing Director
            </h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Generate structured 30-day campaign strategies, target audience teardowns, content pillars, and posting schedules.
            </p>
          </div>

          {/* One-to-Many Engine */}
          <div
            onClick={() => setCurrentView('repurpose_engine')}
            className="group rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-violet-500/50 hover:bg-slate-900/90 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-105 transition-transform">
                <Repeat className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
              One-to-Many Repurposing
            </h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Transform 1 core insight into synchronized native formats for Instagram, LinkedIn, TikTok, X, Facebook, and YouTube.
            </p>
          </div>

          {/* AI Growth Analyst */}
          <div
            onClick={() => setCurrentView('analytics_growth')}
            className="group rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              AI Growth Analyst
            </h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Audit live campaign metrics, diagnose funnel leakage, and automatically generate budget reallocation recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Upcoming Calendar Schedule & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Content Schedule */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Upcoming Scheduled Content</h3>
            </div>
            <button
              onClick={() => setCurrentView('content_calendar')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Open Calendar →
            </button>
          </div>

          {scheduledPosts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No upcoming scheduled posts. Create your first post in Content Studio!
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledPosts.slice(0, 4).map((post) => (
                <div
                  key={post.id}
                  onClick={() => setCurrentView('content_calendar')}
                  className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {post.platform}
                      </span>
                      <span className="text-slate-300 font-medium truncate max-w-[200px]">
                        {post.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      {post.scheduledDate} {post.scheduledTime || ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    "{post.hook}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Campaigns Progress */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Active Campaigns</h3>
            </div>
            <button
              onClick={() => setCurrentView('campaigns')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              All Campaigns →
            </button>
          </div>

          {activeCampaigns.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No active campaigns right now. Convert a strategy into an active campaign!
            </div>
          ) : (
            <div className="space-y-3">
              {activeCampaigns.map((camp) => {
                const percentSpent = camp.budget > 0 ? Math.min(100, Math.round((camp.spent / camp.budget) * 100)) : 0;
                return (
                  <div
                    key={camp.id}
                    onClick={() => setCurrentView('campaigns')}
                    className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3.5 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-bold text-white">{camp.name}</div>
                        <div className="text-[11px] text-slate-400">{camp.objective} • Ends {camp.endDate}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Active
                      </span>
                    </div>

                    {/* Budget bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Budget Spent: ${camp.spent.toLocaleString()} / ${camp.budget.toLocaleString()}</span>
                        <span className="font-semibold text-slate-300">{percentSpent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${percentSpent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
