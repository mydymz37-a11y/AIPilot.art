export type PlatformType =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'x'
  | 'youtube'
  | 'pinterest';

export type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed' | 'archived';

export type ContentStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'ready_to_publish'
  | 'published';

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type PlanType = 'free' | 'starter' | 'pro' | 'agency';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  website: string;
  industry: string;
  description: string;
  productsServices: string;
  targetAudience: string;
  targetCountries: string[];
  customerProblems: string;
  usp: string;
  competitors: string[];
  brandVoice: string;
  preferredLanguages: string[];
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  writingStyle: string;
  prohibitedWords: string[];
  preferredCTAs: string[];
  marketingGoals: string[];
  assetsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyPostingItem {
  dayOrWeek: string;
  channel: string;
  concept: string;
  cta: string;
}

export interface StrategyKPIItem {
  metric: string;
  target: string;
  rationale: string;
}

export interface StrategyChannelRecommendation {
  channel: string;
  strategy: string;
  frequency: string;
}

export interface StrategyContentPillar {
  title: string;
  description: string;
}

export interface MarketingStrategy {
  id: string;
  brandId: string;
  title: string;
  objective: string;
  productOrService: string;
  targetAudience: string;
  targetCountry: string;
  channels: string[];
  durationDays: 7 | 14 | 30;
  budget: string;
  offerPromotion: string;
  desiredOutcome: string;
  sections: {
    executiveSummary: string;
    targetAudienceAnalysis: string;
    customerPainPoints: string[];
    marketingPositioning: string;
    coreCampaignMessage: string;
    contentPillars: StrategyContentPillar[];
    campaignThemes: string[];
    channelRecommendations: StrategyChannelRecommendation[];
    suggestedFormats: string[];
    postingSchedule: StrategyPostingItem[];
    callsToAction: string[];
    suggestedKPIs: StrategyKPIItem[];
    suggestedExperiments: string[];
    optimizationRecommendations: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  objective: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  targetPlatforms: PlatformType[];
  strategyId?: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewComment {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
}

export interface ContentPost {
  id: string;
  brandId: string;
  campaignId?: string;
  platform: PlatformType;
  title: string;
  hook: string;
  bodyText: string;
  callToAction: string;
  hashtags: string[];
  tone: string;
  characterCount: number;
  status: ContentStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  mediaAssetUrl?: string;
  approvalNotes?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  reviewerComments?: ReviewComment[];
  createdAt: string;
  updatedAt: string;
}

export interface RepurposedPackage {
  id: string;
  brandId: string;
  sourceIdea: string;
  title: string;
  items: {
    platform: PlatformType;
    hook: string;
    content: string;
    cta: string;
    visualDirection: string;
    hashtags: string[];
  }[];
  createdAt: string;
}

export interface CreativeAsset {
  id: string;
  brandId: string;
  title: string;
  type:
    | 'concept'
    | 'image_prompt'
    | 'ad_concept'
    | 'design_brief'
    | 'video_script'
    | 'storyboard'
    | 'headline_pack';
  content: string;
  visualDirection?: string;
  dimensions?: string;
  tags: string[];
  mediaUrl?: string;
  createdAt: string;
}

export interface CompetitorAnalysis {
  positioningDifferences: string;
  messagingOpportunities: string[];
  contentThemes: string[];
  offerComparisons: string;
  marketGaps: string[];
  differentiationOpportunities: string[];
  recommendedContentIdeas: string[];
}

export interface Competitor {
  id: string;
  brandId: string;
  name: string;
  websiteUrl: string;
  positioning: string;
  targetAudience: string;
  offerSummary: string;
  marketingExamples: string[];
  notes: string;
  aiAnalysis?: CompetitorAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceRecord {
  id: string;
  brandId: string;
  campaignId?: string;
  campaignName: string;
  channel: string;
  date: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
  notes?: string;
}

export interface GrowthAnalysisResult {
  executiveSummary: string;
  strongestChannels: { channel: string; reason: string; metricHighlight: string }[];
  weakestChannels: { channel: string; issue: string; suggestion: string }[];
  bottlenecksIdentified: string[];
  growthOpportunities: string[];
  suggestedExperiments: string[];
  recommendedBudgetReallocation: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  outputSummary?: string;
}

export interface AutopilotWorkflow {
  id: string;
  brandId: string;
  title: string;
  description: string;
  category: 'campaign_launch' | 'repurpose_flow' | 'growth_optimization';
  steps: WorkflowStep[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  currentUserRole: UserRole;
  currentPlan: PlanType;
  creditsUsed: number;
  creditsLimit: number;
  brandsCount: number;
  maxBrands: number;
  members: TeamMember[];
}

export interface MediaItem {
  id: string;
  brandId: string;
  name: string;
  category: 'logo' | 'product' | 'lifestyle' | 'creative' | 'ad_asset';
  url: string;
  sizeKb: number;
  tags: string[];
  uploadedAt: string;
}
