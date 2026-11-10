import React from 'react';
import {
  Menu,
  Sparkles,
  Plus,
  Compass,
  Megaphone,
  Briefcase,
  Layers,
  RotateCcw,
  Download,
  CheckCircle2,
  HelpCircle,
  LogOut,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onToggleMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobile }) => {
  const {
    currentView,
    setCurrentView,
    activeBrand,
    currentUser,
    currentUserRole,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    resetToDemoData,
    exportAllDataAsJSON,
    isAiAvailable,
  } = useApp();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Marketing Command Center';
      case 'ai_marketing_director':
        return 'AI Marketing Director — Strategic Campaign Generator';
      case 'campaigns':
        return 'Campaign Operations & Performance';
      case 'brand_intelligence':
        return 'Brand Intelligence & Business Brain';
      case 'content_studio':
        return 'Advanced AI Content Studio';
      case 'repurpose_engine':
        return 'One-to-Many Omnichannel Repurposing Engine';
      case 'content_calendar':
        return 'Content Calendar & Publishing Operations';
      case 'creative_studio':
        return 'AI Creative Studio & Visual Concepts';
      case 'competitor_intelligence':
        return 'Competitor Intelligence & Market Gap Teardown';
      case 'analytics_growth':
        return 'Analytics & AI Growth Analyst';
      case 'autopilot':
        return 'AI Marketing Autopilot Workflows';
      case 'brands':
        return 'Brand Portfolio Management';
      case 'media_library':
        return 'Media Asset Library';
      case 'approvals':
        return 'Editorial Approval Queue & Client Review';
      case 'team_clients':
        return 'Team Members & Client Workspaces';
      case 'usage_credits':
        return 'Usage, Quotas & AppSumo Licensing';
      case 'settings':
        return 'Workspace & AI Generation Settings';
      case 'help_support':
        return 'Documentation, Knowledge Base & Support';
      case 'onboarding':
        return 'AIPilot.art Quick Setup Wizard';
      default:
        return 'AIPilot.art';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile menu button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {getPageTitle()}
            </h1>
            {activeBrand && (
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-0.5 text-xs text-slate-300 border border-slate-700/60">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: activeBrand.brandColors.accent || '#6366F1' }}
                />
                <span className="font-medium text-slate-200">{activeBrand.name}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Quick actions, AI Engine Status, Quick Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Engine Status badge */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 text-xs text-indigo-300">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span className="font-medium">
            AI Engine: <strong className="text-white">gemini-3.8-flash</strong>
          </span>
        </div>

        {/* Reset / Backup quick tools */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={resetToDemoData}
            title="Reset workspace to rich demo data"
            className="flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-800/50 hover:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
          <button
            onClick={exportAllDataAsJSON}
            title="Export all workspace data as JSON"
            className="flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-800/50 hover:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Export JSON</span>
          </button>
        </div>

        {/* Primary Action Button based on Role */}
        {currentUserRole !== 'viewer' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('ai_marketing_director')}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Generate Strategy</span>
            </button>
            <button
              onClick={() => setCurrentView('content_studio')}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-indigo-400" />
              <span>Create Post</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs text-amber-300">
            <span>Read-Only Mode (Viewer)</span>
          </div>
        )}

        {/* User Account / Logout */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{currentUser.email}</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out of AIPilot.art"
              className="flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-800/60 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 p-2 text-slate-400 transition-colors"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            <User className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
