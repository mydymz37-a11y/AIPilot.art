import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';

// Views
import { DashboardView } from './components/views/DashboardView';
import { AIMarketingDirectorView } from './components/views/AIMarketingDirectorView';
import { CampaignsView } from './components/views/CampaignsView';
import { BrandIntelligenceView } from './components/views/BrandIntelligenceView';
import { ContentStudioView } from './components/views/ContentStudioView';
import { RepurposeEngineView } from './components/views/RepurposeEngineView';
import { ContentCalendarView } from './components/views/ContentCalendarView';
import { CreativeStudioView } from './components/views/CreativeStudioView';
import { CompetitorIntelligenceView } from './components/views/CompetitorIntelligenceView';
import { AnalyticsGrowthView } from './components/views/AnalyticsGrowthView';
import { AutopilotView } from './components/views/AutopilotView';
import { ApprovalsView } from './components/views/ApprovalsView';
import { MediaLibraryView } from './components/views/MediaLibraryView';
import { TeamClientsView } from './components/views/TeamClientsView';
import { UsageCreditsView } from './components/views/UsageCreditsView';
import { SettingsView } from './components/views/SettingsView';
import { HelpSupportView } from './components/views/HelpSupportView';
import { LandingPageView } from './components/views/LandingPageView';
import { OnboardingView } from './components/views/OnboardingView';

const AppContent: React.FC = () => {
  const { currentView, currentUser, setIsAuthModalOpen, setAuthModalMode, setCurrentView } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If user is viewing the public marketing landing page or onboarding wizard:
  if (currentView === 'landing') {
    return (
      <>
        <LandingPageView />
        <AuthModal />
        <ToastContainer />
      </>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <>
        <OnboardingView />
        <AuthModal />
        <ToastContainer />
      </>
    );
  }

  // Protected Route Check: If logged out, show access gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-5">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Authentication Required
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            This workspace area is protected. Please sign in or register an account to access your AI marketing department, campaigns, and brand intelligence.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Sign In to Your Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 text-xs font-bold text-slate-300 transition-colors"
            >
              <span>Create New Account</span>
            </button>
            <button
              onClick={() => setCurrentView('landing')}
              className="w-full text-xs text-slate-400 hover:text-slate-300 pt-2 transition-colors"
            >
              ← Return to Public Landing Page
            </button>
          </div>
        </div>
        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

  // Active App Dashboard Shell
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'ai_marketing_director':
        return <AIMarketingDirectorView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'brand_intelligence':
      case 'brands':
        return <BrandIntelligenceView />;
      case 'content_studio':
        return <ContentStudioView />;
      case 'repurpose_engine':
        return <RepurposeEngineView />;
      case 'content_calendar':
        return <ContentCalendarView />;
      case 'creative_studio':
        return <CreativeStudioView />;
      case 'competitor_intelligence':
        return <CompetitorIntelligenceView />;
      case 'analytics_growth':
        return <AnalyticsGrowthView />;
      case 'autopilot':
        return <AutopilotView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'media_library':
        return <MediaLibraryView />;
      case 'team_clients':
        return <TeamClientsView />;
      case 'usage_credits':
        return <UsageCreditsView />;
      case 'settings':
        return <SettingsView />;
      case 'help_support':
        return <HelpSupportView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area (offset by sidebar width on large screens) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Header onToggleMobile={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>

      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
