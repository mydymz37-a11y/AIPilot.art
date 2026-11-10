import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Megaphone,
  BrainCircuit,
  PenTool,
  Repeat,
  Calendar,
  Sparkles,
  Search,
  TrendingUp,
  Workflow,
  Briefcase,
  Image,
  CheckSquare,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronDown,
  Plus,
  Sparkle,
  Globe,
  Shield,
  Layers,
  X,
} from 'lucide-react';
import { useApp, NavigationPage } from '../../context/AppContext';
import { UserRole } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    currentView,
    setCurrentView,
    brands,
    activeBrand,
    activeBrandId,
    switchBrand,
    currentUserRole,
    setCurrentUserRole,
    creditsUsed,
    creditsLimit,
  } = useApp();

  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems: {
    category: 'MAIN' | 'WORKSPACE' | 'ACCOUNT';
    items: { id: NavigationPage; label: string; icon: React.ElementType; badge?: string }[];
  }[] = [
    {
      category: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ai_marketing_director', label: 'AI Marketing Director', icon: Compass, badge: 'AI' },
        { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
        { id: 'brand_intelligence', label: 'Brand Intelligence', icon: BrainCircuit },
        { id: 'content_studio', label: 'Content Studio', icon: PenTool },
        { id: 'repurpose_engine', label: 'One-to-Many Engine', icon: Repeat, badge: 'Pro' },
        { id: 'content_calendar', label: 'Content Calendar', icon: Calendar },
        { id: 'creative_studio', label: 'Creative Studio', icon: Sparkles },
        { id: 'competitor_intelligence', label: 'Competitor Intel', icon: Search },
        { id: 'analytics_growth', label: 'Analytics & Growth', icon: TrendingUp },
        { id: 'autopilot', label: 'AI Autopilot', icon: Workflow, badge: 'Auto' },
      ],
    },
    {
      category: 'WORKSPACE',
      items: [
        { id: 'brands', label: 'Brands', icon: Briefcase },
        { id: 'media_library', label: 'Media Library', icon: Image },
        { id: 'approvals', label: 'Approvals', icon: CheckSquare },
        { id: 'team_clients', label: 'Team & Clients', icon: Users },
      ],
    },
    {
      category: 'ACCOUNT',
      items: [
        { id: 'usage_credits', label: 'Usage & Credits', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help_support', label: 'Help & Support', icon: HelpCircle },
      ],
    },
  ];

  const handleNavClick = (id: NavigationPage) => {
    setCurrentView(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#0B0F19] border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800/80">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
              <Sparkle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  AIPilot<span className="text-indigo-400">.art</span>
                </span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                YOUR AI MARKETING DEPT
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Brand Switcher Bar */}
        <div className="p-3 border-b border-slate-800/60 bg-slate-900/40 relative">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center justify-between">
            <span>Active Brand</span>
            <span className="text-[10px] text-slate-400">{brands.length} Total</span>
          </div>
          <button
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            className="flex w-full items-center justify-between rounded-lg bg-slate-800/70 hover:bg-slate-800 px-3 py-2 text-left text-sm font-medium text-slate-200 border border-slate-700/60 transition-colors"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeBrand?.brandColors.accent || '#6366F1' }}
              />
              <span className="truncate font-semibold text-slate-100">
                {activeBrand?.name || 'Select Brand'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
          </button>

          {/* Brand Switcher Menu */}
          {brandDropdownOpen && (
            <div className="absolute top-full left-3 right-3 z-50 mt-1 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden py-1">
              <div className="max-h-56 overflow-y-auto">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      switchBrand(b.id);
                      setBrandDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-800 transition-colors ${
                      b.id === activeBrandId ? 'bg-indigo-600/10 text-indigo-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: b.brandColors.accent }}
                      />
                      <span className="truncate">{b.name}</span>
                    </div>
                    {b.id === activeBrandId && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800 p-1.5">
                <button
                  onClick={() => {
                    handleNavClick('brands');
                    setBrandDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create or Manage Brands</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((section) => (
            <div key={section.category}>
              <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.category}
              </p>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Marketing Website link */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-emerald-400" />
                <span>Marketing Landing Page</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Preview
              </span>
            </button>
          </div>
        </div>

        {/* Footer: AI Credit Meter & Role Switcher */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 space-y-3">
          {/* Credit meter */}
          <div className="rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/40">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" /> AI Credits
              </span>
              <span className="font-semibold text-slate-200">
                {creditsUsed} / {creditsLimit}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (creditsUsed / creditsLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex w-full items-center justify-between rounded-lg bg-slate-800/40 hover:bg-slate-800/80 px-2.5 py-2 text-xs text-left border border-slate-700/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                <div className="leading-tight">
                  <div className="text-[10px] text-slate-400">Logged in as</div>
                  <div className="font-semibold text-slate-200 capitalize">
                    {currentUserRole}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl bg-slate-900 border border-slate-700 p-1 shadow-2xl z-50">
                <div className="px-2 py-1 text-[10px] text-slate-400 font-semibold uppercase">
                  Simulate Role Access
                </div>
                {(['owner', 'admin', 'editor', 'viewer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentUserRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left capitalize transition-colors ${
                      currentUserRole === r
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUserRole === r && <span className="text-[10px]">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
