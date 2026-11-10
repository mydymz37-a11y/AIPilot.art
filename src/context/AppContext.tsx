import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BrandProfile,
  Campaign,
  ContentPost,
  MarketingStrategy,
  Competitor,
  PerformanceRecord,
  CreativeAsset,
  AutopilotWorkflow,
  TeamMember,
  MediaItem,
  UserRole,
  PlanType,
  PlatformType,
  UserAccount,
} from '../types';
import {
  INITIAL_BRANDS,
  INITIAL_CAMPAIGNS,
  INITIAL_POSTS,
  INITIAL_COMPETITORS,
  INITIAL_PERFORMANCE_RECORDS,
  INITIAL_CREATIVE_ASSETS,
  INITIAL_WORKFLOWS,
  INITIAL_MEMBERS,
  INITIAL_MEDIA_ITEMS,
} from '../data/initialData';

export type NavigationPage =
  | 'dashboard'
  | 'ai_marketing_director'
  | 'campaigns'
  | 'brand_intelligence'
  | 'content_studio'
  | 'repurpose_engine'
  | 'content_calendar'
  | 'creative_studio'
  | 'competitor_intelligence'
  | 'analytics_growth'
  | 'autopilot'
  | 'brands'
  | 'media_library'
  | 'approvals'
  | 'team_clients'
  | 'usage_credits'
  | 'settings'
  | 'help_support'
  | 'landing'
  | 'onboarding';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

const DEMO_USER: UserAccount = {
  id: 'user-alexander',
  name: 'Alexander Vance',
  email: 'alexander@nexusflow.io',
  role: 'owner',
  createdAt: '2026-08-01T00:00:00Z',
};

interface AppContextType {
  currentUser: UserAccount | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  currentView: NavigationPage;
  setCurrentView: (view: NavigationPage) => void;
  brands: BrandProfile[];
  activeBrandId: string;
  activeBrand: BrandProfile | null;
  switchBrand: (brandId: string) => void;
  createBrand: (brandData: Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt' | 'assetsCount'>) => BrandProfile;
  updateBrand: (id: string, updates: Partial<BrandProfile>) => void;
  duplicateBrand: (id: string) => void;
  deleteBrand: (id: string) => void;

  campaigns: Campaign[];
  createCampaign: (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  duplicateCampaign: (id: string) => void;
  deleteCampaign: (id: string) => void;

  posts: ContentPost[];
  createPost: (data: Omit<ContentPost, 'id' | 'createdAt' | 'updatedAt'>) => ContentPost;
  updatePost: (id: string, updates: Partial<ContentPost>) => void;
  duplicatePost: (id: string) => void;
  deletePost: (id: string) => void;
  addReviewComment: (postId: string, text: string) => void;
  updatePostApproval: (postId: string, approvalStatus: 'approved' | 'rejected' | 'needs_revision' | 'pending') => void;

  strategies: MarketingStrategy[];
  saveStrategy: (strategy: MarketingStrategy) => void;
  convertStrategyToCampaignAndCalendar: (strat: MarketingStrategy) => { campaignId: string; postsCreated: number };

  competitors: Competitor[];
  createCompetitor: (data: Omit<Competitor, 'id' | 'createdAt' | 'updatedAt'>) => Competitor;
  updateCompetitor: (id: string, updates: Partial<Competitor>) => void;
  deleteCompetitor: (id: string) => void;

  performanceRecords: PerformanceRecord[];
  addPerformanceRecord: (rec: Omit<PerformanceRecord, 'id'>) => void;
  importPerformanceRecords: (records: Omit<PerformanceRecord, 'id'>[]) => number;

  creativeAssets: CreativeAsset[];
  createCreativeAsset: (data: Omit<CreativeAsset, 'id' | 'createdAt'>) => CreativeAsset;
  deleteCreativeAsset: (id: string) => void;

  workflows: AutopilotWorkflow[];
  updateWorkflow: (id: string, updates: Partial<AutopilotWorkflow>) => void;

  teamMembers: TeamMember[];
  addTeamMember: (data: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  updateTeamMemberRole: (id: string, role: UserRole) => void;
  removeTeamMember: (id: string) => void;

  mediaItems: MediaItem[];
  addMediaItem: (data: Omit<MediaItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;

  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentPlan: PlanType;
  setCurrentPlan: (plan: PlanType) => void;
  creditsUsed: number;
  creditsLimit: number;
  consumeCredit: (amount?: number) => boolean;

  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  resetToDemoData: () => void;
  exportAllDataAsJSON: () => void;
  isAiAvailable: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_BASE = 'aipilot_data_v2_';

function getUserStorageKey(userId: string | null | undefined, key: string) {
  const scope = userId ? `u_${userId}` : 'u_guest';
  return `${STORAGE_KEY_BASE}${scope}_${key}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem('aipilot_auth_user');
      if (savedUser) return JSON.parse(savedUser);
      // Default to demo user if not logged out
      return DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // View state
  const initialView: NavigationPage = (() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autostart') === '1' || urlParams.get('app') === '1') {
        return 'dashboard';
      }
      const savedView = localStorage.getItem(`${STORAGE_KEY_BASE}view`) as NavigationPage;
      if (savedView) return savedView;
    }
    return 'dashboard';
  })();

  const [currentView, setCurrentViewRaw] = useState<NavigationPage>(initialView);
  const setCurrentView = (view: NavigationPage) => {
    setCurrentViewRaw(view);
    try {
      localStorage.setItem(`${STORAGE_KEY_BASE}view`, view);
    } catch {
      // ignore
    }
  };

  // Helper to load user-isolated data
  const loadUserDataset = useCallback((userId: string | null) => {
    try {
      const bKey = getUserStorageKey(userId, 'brands');
      const savedBrands = localStorage.getItem(bKey);
      let loadedBrands: BrandProfile[];

      if (savedBrands) {
        loadedBrands = JSON.parse(savedBrands);
      } else if (!userId || userId === DEMO_USER.id) {
        loadedBrands = INITIAL_BRANDS;
      } else {
        // Isolated starter brand for newly registered users
        loadedBrands = [
          {
            id: `brand-${Date.now()}`,
            name: 'My Primary Brand',
            website: 'https://example.com',
            industry: 'Technology & E-Commerce',
            description: 'AI-driven innovative products designed for forward-thinking modern consumers and businesses.',
            productsServices: 'Core SaaS Platform, Onboarding Concierge, Enterprise API',
            targetAudience: 'Digital entrepreneurs, modern marketing teams, high-growth startups.',
            targetCountries: ['United States', 'United Kingdom', 'Canada'],
            customerProblems: 'Fragmented marketing channels and lack of consistent omnichannel messaging.',
            usp: 'Complete AI-orchestrated strategy to execution in minutes.',
            competitors: ['MarketLeader', 'GrowthHQ'],
            brandVoice: 'Visionary, High-Converting, Direct & Trustworthy',
            preferredLanguages: ['English (US)'],
            brandColors: {
              primary: '#0F172A',
              secondary: '#6366F1',
              accent: '#06B6D4',
            },
            writingStyle: 'Direct, value-oriented statements, concise paragraphs.',
            prohibitedWords: ['spam', 'cheap', 'clickbait'],
            preferredCTAs: ['Start Your Free Trial', 'Explore Live Demo', 'Book Strategy Call'],
            marketingGoals: ['Scale qualified inbound leads by 50%', 'Increase social engagement'],
            assetsCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }

      const activeBKey = getUserStorageKey(userId, 'active_brand');
      const savedActiveBrand = localStorage.getItem(activeBKey) || (loadedBrands[0]?.id ?? '');

      const getArr = <T,>(key: string, defaultArr: T[]): T[] => {
        const fullKey = getUserStorageKey(userId, key);
        const saved = localStorage.getItem(fullKey);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            return defaultArr;
          }
        }
        return (!userId || userId === DEMO_USER.id) ? defaultArr : [];
      };

      return {
        brands: loadedBrands,
        activeBrandId: savedActiveBrand,
        campaigns: getArr('campaigns', INITIAL_CAMPAIGNS),
        posts: getArr('posts', INITIAL_POSTS),
        strategies: getArr<MarketingStrategy>('strategies', []),
        competitors: getArr('competitors', INITIAL_COMPETITORS),
        performance: getArr('performance', INITIAL_PERFORMANCE_RECORDS),
        creatives: getArr('creatives', INITIAL_CREATIVE_ASSETS),
        workflows: getArr('workflows', INITIAL_WORKFLOWS),
        members: getArr('members', INITIAL_MEMBERS),
        media: getArr('media', INITIAL_MEDIA_ITEMS),
      };
    } catch {
      return {
        brands: INITIAL_BRANDS,
        activeBrandId: INITIAL_BRANDS[0]?.id ?? '',
        campaigns: INITIAL_CAMPAIGNS,
        posts: INITIAL_POSTS,
        strategies: [],
        competitors: INITIAL_COMPETITORS,
        performance: INITIAL_PERFORMANCE_RECORDS,
        creatives: INITIAL_CREATIVE_ASSETS,
        workflows: INITIAL_WORKFLOWS,
        members: INITIAL_MEMBERS,
        media: INITIAL_MEDIA_ITEMS,
      };
    }
  }, []);

  // Initial hydrated data
  const initialData = loadUserDataset(currentUser ? currentUser.id : null);

  const [brands, setBrands] = useState<BrandProfile[]>(initialData.brands);
  const [activeBrandId, setActiveBrandId] = useState<string>(initialData.activeBrandId);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialData.campaigns);
  const [posts, setPosts] = useState<ContentPost[]>(initialData.posts);
  const [strategies, setStrategies] = useState<MarketingStrategy[]>(initialData.strategies);
  const [competitors, setCompetitors] = useState<Competitor[]>(initialData.competitors);
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>(initialData.performance);
  const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>(initialData.creatives);
  const [workflows, setWorkflows] = useState<AutopilotWorkflow[]>(initialData.workflows);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialData.members);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialData.media);

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('owner');
  const [currentPlan, setCurrentPlan] = useState<PlanType>('pro');
  const [creditsUsed, setCreditsUsed] = useState<number>(42);
  const [creditsLimit] = useState<number>(500);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAiAvailable, setIsAiAvailable] = useState<boolean>(true);

  // Sync dataset whenever currentUser changes
  const applyUserDataset = useCallback((userId: string | null) => {
    const data = loadUserDataset(userId);
    setBrands(data.brands);
    setActiveBrandId(data.activeBrandId);
    setCampaigns(data.campaigns);
    setPosts(data.posts);
    setStrategies(data.strategies);
    setCompetitors(data.competitors);
    setPerformanceRecords(data.performance);
    setCreativeAssets(data.creatives);
    setWorkflows(data.workflows);
    setTeamMembers(data.members);
    setMediaItems(data.media);
  }, [loadUserDataset]);

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'ok') {
          setIsAiAvailable(true);
        }
      })
      .catch(() => {
        setIsAiAvailable(true);
      });
  }, []);

  // Sync to LocalStorage on updates for current user
  useEffect(() => {
    const uid = currentUser ? currentUser.id : null;
    try {
      localStorage.setItem(getUserStorageKey(uid, 'brands'), JSON.stringify(brands));
      localStorage.setItem(getUserStorageKey(uid, 'active_brand'), activeBrandId);
      localStorage.setItem(getUserStorageKey(uid, 'campaigns'), JSON.stringify(campaigns));
      localStorage.setItem(getUserStorageKey(uid, 'posts'), JSON.stringify(posts));
      localStorage.setItem(getUserStorageKey(uid, 'strategies'), JSON.stringify(strategies));
      localStorage.setItem(getUserStorageKey(uid, 'competitors'), JSON.stringify(competitors));
      localStorage.setItem(getUserStorageKey(uid, 'performance'), JSON.stringify(performanceRecords));
      localStorage.setItem(getUserStorageKey(uid, 'creatives'), JSON.stringify(creativeAssets));
      localStorage.setItem(getUserStorageKey(uid, 'workflows'), JSON.stringify(workflows));
      localStorage.setItem(getUserStorageKey(uid, 'members'), JSON.stringify(teamMembers));
      localStorage.setItem(getUserStorageKey(uid, 'media'), JSON.stringify(mediaItems));
    } catch {
      // ignore
    }
  }, [
    currentUser,
    brands,
    activeBrandId,
    campaigns,
    posts,
    strategies,
    competitors,
    performanceRecords,
    creativeAssets,
    workflows,
    teamMembers,
    mediaItems,
  ]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Operations
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid email or password.' };
      }

      const user: UserAccount = data.user;
      setCurrentUser(user);
      localStorage.setItem('aipilot_auth_user', JSON.stringify(user));
      localStorage.setItem('aipilot_auth_token', data.token);
      applyUserDataset(user.id);
      showToast(`Welcome back, ${user.name}!`, 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      return { success: false, error: msg };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      const user: UserAccount = data.user;
      setCurrentUser(user);
      localStorage.setItem('aipilot_auth_user', JSON.stringify(user));
      localStorage.setItem('aipilot_auth_token', data.token);
      applyUserDataset(user.id);
      showToast(`Welcome to AIPilot.art, ${user.name}!`, 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    const token = localStorage.getItem('aipilot_auth_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('aipilot_auth_user');
    localStorage.removeItem('aipilot_auth_token');
    setCurrentUser(null);
    setCurrentView('landing');
    showToast('Signed out of AIPilot.art', 'info');
  };

  const consumeCredit = (amount: number = 1): boolean => {
    if (creditsUsed + amount > creditsLimit) {
      showToast('AI Generation limit reached for your current billing cycle. Upgrade in Usage & Credits.', 'warning');
      return false;
    }
    setCreditsUsed((prev) => prev + amount);
    return true;
  };

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0] || null;

  const switchBrand = (brandId: string) => {
    const target = brands.find((b) => b.id === brandId);
    if (target) {
      setActiveBrandId(brandId);
      showToast(`Switched active workspace to "${target.name}"`, 'info');
    }
  };

  // Brand Management
  const createBrand = (brandData: Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt' | 'assetsCount'>): BrandProfile => {
    const newBrand: BrandProfile = {
      ...brandData,
      id: `brand-${Date.now()}`,
      assetsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBrands((prev) => [...prev, newBrand]);
    setActiveBrandId(newBrand.id);
    showToast(`Brand "${newBrand.name}" created successfully`, 'success');
    return newBrand;
  };

  const updateBrand = (id: string, updates: Partial<BrandProfile>) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b))
    );
    showToast('Brand profile updated', 'success');
  };

  const duplicateBrand = (id: string) => {
    const target = brands.find((b) => b.id === id);
    if (!target) return;
    const duplicated: BrandProfile = {
      ...target,
      id: `brand-${Date.now()}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBrands((prev) => [...prev, duplicated]);
    showToast(`Duplicated brand profile as "${duplicated.name}"`, 'success');
  };

  const deleteBrand = (id: string) => {
    if (brands.length <= 1) {
      showToast('Cannot delete the only existing brand. Keep at least one brand in your workspace.', 'warning');
      return;
    }
    const target = brands.find((b) => b.id === id);
    setBrands((prev) => prev.filter((b) => b.id !== id));
    if (activeBrandId === id) {
      const remaining = brands.filter((b) => b.id !== id);
      if (remaining.length > 0) setActiveBrandId(remaining[0].id);
    }
    showToast(`Deleted brand "${target?.name || 'profile'}"`, 'info');
  };

  // Campaign Management
  const createCampaign = (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign => {
    const newCamp: Campaign = {
      ...data,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    showToast(`Campaign "${newCamp.name}" launched!`, 'success');
    return newCamp;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
    showToast('Campaign updated', 'success');
  };

  const duplicateCampaign = (id: string) => {
    const target = campaigns.find((c) => c.id === id);
    if (!target) return;
    const duplicated: Campaign = {
      ...target,
      id: `camp-${Date.now()}`,
      name: `${target.name} (Copy)`,
      status: 'planning',
      spent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCampaigns((prev) => [duplicated, ...prev]);
    showToast(`Duplicated campaign as "${duplicated.name}"`, 'success');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToast('Campaign removed', 'info');
  };

  // Posts / Content Management
  const createPost = (data: Omit<ContentPost, 'id' | 'createdAt' | 'updatedAt'>): ContentPost => {
    const newPost: ContentPost = {
      ...data,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast(`Post created for ${newPost.platform.toUpperCase()}`, 'success');
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<ContentPost>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const duplicatePost = (id: string) => {
    const target = posts.find((p) => p.id === id);
    if (!target) return;
    const duplicated: ContentPost = {
      ...target,
      id: `post-${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts((prev) => [duplicated, ...prev]);
    showToast(`Duplicated post draft`, 'success');
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('Content post deleted', 'info');
  };

  const addReviewComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const comment = {
          id: `comm-${Date.now()}`,
          author: currentUser ? `${currentUser.name} (${currentUserRole})` : 'Team Reviewer',
          role: currentUserRole,
          text,
          date: new Date().toLocaleString(),
        };
        return {
          ...p,
          reviewerComments: [...(p.reviewerComments || []), comment],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast('Feedback comment added', 'success');
  };

  const updatePostApproval = (
    postId: string,
    approvalStatus: 'approved' | 'rejected' | 'needs_revision' | 'pending'
  ) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newStatus = approvalStatus === 'approved' ? 'approved' : p.status;
        return {
          ...p,
          approvalStatus,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Post marked as ${approvalStatus.replace('_', ' ').toUpperCase()}`, 'info');
  };

  // Strategy Management
  const saveStrategy = (strategy: MarketingStrategy) => {
    setStrategies((prev) => {
      const idx = prev.findIndex((s) => s.id === strategy.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = strategy;
        return copy;
      }
      return [strategy, ...prev];
    });
    showToast('Strategy blueprint saved successfully', 'success');
  };

  const convertStrategyToCampaignAndCalendar = (strat: MarketingStrategy) => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (strat.durationDays || 30));

    const channels = strat.channels.map((c) => c.toLowerCase() as PlatformType);
    const validPlatforms: PlatformType[] = channels.filter((c) =>
      ['instagram', 'facebook', 'linkedin', 'tiktok', 'x', 'youtube', 'pinterest'].includes(c)
    );

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      brandId: strat.brandId,
      name: `${strat.title || 'Integrated Strategy Campaign'}`,
      objective: strat.objective,
      targetAudience: strat.targetAudience,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      targetPlatforms: validPlatforms.length > 0 ? validPlatforms : ['linkedin', 'x'],
      strategyId: strat.id,
      status: 'active',
      budget: parseFloat(strat.budget.replace(/[^0-9.]/g, '')) || 2500,
      spent: 0,
      performance: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaigns((prev) => [newCampaign, ...prev]);

    // Create calendar posts from posting schedule
    const createdPosts: ContentPost[] = (strat.sections.postingSchedule || []).map((item, idx) => {
      const postDate = new Date(today);
      postDate.setDate(today.getDate() + (idx * 2 + 1));
      const platformKey = item.channel.toLowerCase() as PlatformType;
      const safePlatform: PlatformType = ['instagram', 'facebook', 'linkedin', 'tiktok', 'x', 'youtube', 'pinterest'].includes(platformKey)
        ? platformKey
        : 'linkedin';

      return {
        id: `post-${Date.now()}-${idx}`,
        brandId: strat.brandId,
        campaignId: newCampaign.id,
        platform: safePlatform,
        title: item.concept,
        hook: `Key insight from our ${strat.title}: ${item.concept}`,
        bodyText: `${item.concept}\n\nStrategic Pillar: ${strat.sections.contentPillars?.[idx % (strat.sections.contentPillars?.length || 1)]?.title || 'Brand Value'}\n\nTarget Outcome: ${strat.desiredOutcome}`,
        callToAction: item.cta || 'Learn more at our website',
        hashtags: ['#Growth', '#MarketingStrategy', `#${strat.objective.replace(/\s+/g, '')}`],
        tone: 'Professional & High-Converting',
        characterCount: 320,
        status: 'ready_to_publish',
        scheduledDate: postDate.toISOString().split('T')[0],
        scheduledTime: '10:00',
        approvalStatus: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    if (createdPosts.length > 0) {
      setPosts((prev) => [...createdPosts, ...prev]);
    }

    showToast(`Campaign created & ${createdPosts.length} posts scheduled into Content Calendar!`, 'success');
    return { campaignId: newCampaign.id, postsCreated: createdPosts.length };
  };

  // Competitor Intelligence
  const createCompetitor = (data: Omit<Competitor, 'id' | 'createdAt' | 'updatedAt'>): Competitor => {
    const newComp: Competitor = {
      ...data,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCompetitors((prev) => [newComp, ...prev]);
    showToast(`Competitor "${newComp.name}" logged`, 'success');
    return newComp;
  };

  const updateCompetitor = (id: string, updates: Partial<Competitor>) => {
    setCompetitors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
    showToast('Competitor data updated', 'success');
  };

  const deleteCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    showToast('Competitor removed', 'info');
  };

  // Analytics & Performance
  const addPerformanceRecord = (rec: Omit<PerformanceRecord, 'id'>) => {
    const newRecord: PerformanceRecord = {
      ...rec,
      id: `perf-${Date.now()}`,
    };
    setPerformanceRecords((prev) => [newRecord, ...prev]);
    showToast('Performance record logged', 'success');
  };

  const importPerformanceRecords = (records: Omit<PerformanceRecord, 'id'>[]): number => {
    const newRecords: PerformanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `perf-imp-${Date.now()}-${i}`,
    }));
    setPerformanceRecords((prev) => [...newRecords, ...prev]);
    showToast(`Successfully imported ${newRecords.length} performance rows`, 'success');
    return newRecords.length;
  };

  // Creative Assets
  const createCreativeAsset = (data: Omit<CreativeAsset, 'id' | 'createdAt'>): CreativeAsset => {
    const newAsset: CreativeAsset = {
      ...data,
      id: `creat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCreativeAssets((prev) => [newAsset, ...prev]);
    showToast(`Saved creative asset: "${newAsset.title}"`, 'success');
    return newAsset;
  };

  const deleteCreativeAsset = (id: string) => {
    setCreativeAssets((prev) => prev.filter((a) => a.id !== id));
    showToast('Creative asset deleted', 'info');
  };

  // Autopilot Workflows
  const updateWorkflow = (id: string, updates: Partial<AutopilotWorkflow>) => {
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  // Team & Workspace
  const addTeamMember = (data: Omit<TeamMember, 'id' | 'joinedAt'>) => {
    const newMember: TeamMember = {
      ...data,
      id: `m-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setTeamMembers((prev) => [...prev, newMember]);
    showToast(`Invited ${newMember.name} as ${newMember.role.toUpperCase()}`, 'success');
  };

  const updateTeamMemberRole = (id: string, role: UserRole) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    showToast('Team role updated', 'info');
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Team member removed', 'info');
  };

  // Media Items
  const addMediaItem = (data: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const newItem: MediaItem = {
      ...data,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setMediaItems((prev) => [newItem, ...prev]);
    showToast(`Uploaded asset "${newItem.name}"`, 'success');
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
    showToast('Asset removed from library', 'info');
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setBrands(INITIAL_BRANDS);
    setActiveBrandId(INITIAL_BRANDS[0].id);
    setCampaigns(INITIAL_CAMPAIGNS);
    setPosts(INITIAL_POSTS);
    setCompetitors(INITIAL_COMPETITORS);
    setPerformanceRecords(INITIAL_PERFORMANCE_RECORDS);
    setCreativeAssets(INITIAL_CREATIVE_ASSETS);
    setWorkflows(INITIAL_WORKFLOWS);
    setTeamMembers(INITIAL_MEMBERS);
    setMediaItems(INITIAL_MEDIA_ITEMS);
    setCreditsUsed(42);
    showToast('Restored workspace to complete demo data state', 'info');
  };

  // Export JSON Backup
  const exportAllDataAsJSON = () => {
    const fullBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: currentUser,
      brands,
      campaigns,
      posts,
      strategies,
      competitors,
      performanceRecords,
      creativeAssets,
      workflows,
      teamMembers,
    };
    const jsonStr = JSON.stringify(fullBackup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIPilot-workspace-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workspace backup JSON downloaded', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        logout,
        currentView,
        setCurrentView,
        brands,
        activeBrandId,
        activeBrand,
        switchBrand,
        createBrand,
        updateBrand,
        duplicateBrand,
        deleteBrand,
        campaigns,
        createCampaign,
        updateCampaign,
        duplicateCampaign,
        deleteCampaign,
        posts,
        createPost,
        updatePost,
        duplicatePost,
        deletePost,
        addReviewComment,
        updatePostApproval,
        strategies,
        saveStrategy,
        convertStrategyToCampaignAndCalendar,
        competitors,
        createCompetitor,
        updateCompetitor,
        deleteCompetitor,
        performanceRecords,
        addPerformanceRecord,
        importPerformanceRecords,
        creativeAssets,
        createCreativeAsset,
        deleteCreativeAsset,
        workflows,
        updateWorkflow,
        teamMembers,
        addTeamMember,
        updateTeamMemberRole,
        removeTeamMember,
        mediaItems,
        addMediaItem,
        deleteMediaItem,
        currentUserRole,
        setCurrentUserRole,
        currentPlan,
        setCurrentPlan,
        creditsUsed,
        creditsLimit,
        consumeCredit,
        toasts,
        showToast,
        removeToast,
        resetToDemoData,
        exportAllDataAsJSON,
        isAiAvailable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
