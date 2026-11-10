/**
 * Pure calculation utilities for Marketing Performance Metrics
 * All calculations handle zero denominators, NaN, and undefined values safely.
 */

export interface MarketingMetricsInput {
  spend?: number | null;
  impressions?: number | null;
  reach?: number | null;
  clicks?: number | null;
  leads?: number | null;
  conversions?: number | null;
  revenue?: number | null;
}

export interface CalculatedMarketingMetrics {
  ctr: number; // Click-Through Rate (%)
  cvr: number; // Conversion Rate (%)
  cpa: number; // Cost Per Acquisition ($)
  cpc: number; // Cost Per Click ($)
  roas: number; // Return on Ad Spend (multiplier e.g. 3.5x)
  cpl: number; // Cost Per Lead ($)
  profit: number; // Revenue - Spend ($)
}

/**
 * Click-Through Rate: (Clicks / Impressions) * 100
 */
export function calculateCTR(clicks: number | null | undefined, impressions: number | null | undefined): number {
  const safeClicks = Math.max(0, Number(clicks) || 0);
  const safeImpressions = Math.max(0, Number(impressions) || 0);
  if (safeImpressions === 0) return 0;
  const result = (safeClicks / safeImpressions) * 100;
  return Number(result.toFixed(2));
}

/**
 * Conversion Rate: (Conversions / Clicks) * 100
 */
export function calculateCVR(conversions: number | null | undefined, clicks: number | null | undefined): number {
  const safeConversions = Math.max(0, Number(conversions) || 0);
  const safeClicks = Math.max(0, Number(clicks) || 0);
  if (safeClicks === 0) return 0;
  const result = (safeConversions / safeClicks) * 100;
  return Number(result.toFixed(2));
}

/**
 * Cost Per Acquisition (CPA): Spend / Conversions
 */
export function calculateCPA(spend: number | null | undefined, conversions: number | null | undefined): number {
  const safeSpend = Math.max(0, Number(spend) || 0);
  const safeConversions = Math.max(0, Number(conversions) || 0);
  if (safeConversions === 0) return 0;
  const result = safeSpend / safeConversions;
  return Number(result.toFixed(2));
}

/**
 * Cost Per Click (CPC): Spend / Clicks
 */
export function calculateCPC(spend: number | null | undefined, clicks: number | null | undefined): number {
  const safeSpend = Math.max(0, Number(spend) || 0);
  const safeClicks = Math.max(0, Number(clicks) || 0);
  if (safeClicks === 0) return 0;
  const result = safeSpend / safeClicks;
  return Number(result.toFixed(2));
}

/**
 * Return on Ad Spend (ROAS): Revenue / Spend
 */
export function calculateROAS(revenue: number | null | undefined, spend: number | null | undefined): number {
  const safeRevenue = Math.max(0, Number(revenue) || 0);
  const safeSpend = Math.max(0, Number(spend) || 0);
  if (safeSpend === 0) return 0;
  const result = safeRevenue / safeSpend;
  return Number(result.toFixed(2));
}

/**
 * Calculate all metrics together
 */
export function calculateAllMetrics(input: MarketingMetricsInput): CalculatedMarketingMetrics {
  const spend = Math.max(0, Number(input.spend) || 0);
  const revenue = Math.max(0, Number(input.revenue) || 0);
  const leads = Math.max(0, Number(input.leads) || 0);

  const cpl = leads > 0 ? Number((spend / leads).toFixed(2)) : 0;
  const profit = Number((revenue - spend).toFixed(2));

  return {
    ctr: calculateCTR(input.clicks, input.impressions),
    cvr: calculateCVR(input.conversions, input.clicks),
    cpa: calculateCPA(input.spend, input.conversions),
    cpc: calculateCPC(input.spend, input.clicks),
    roas: calculateROAS(input.revenue, input.spend),
    cpl,
    profit,
  };
}

/**
 * Platform character limits and validation
 */
export const PLATFORM_LIMITS: Record<string, { maxChars: number; label: string; iconName: string }> = {
  instagram: { maxChars: 2200, label: 'Instagram', iconName: 'Instagram' },
  facebook: { maxChars: 63206, label: 'Facebook', iconName: 'Facebook' },
  linkedin: { maxChars: 3000, label: 'LinkedIn', iconName: 'Linkedin' },
  tiktok: { maxChars: 2200, label: 'TikTok', iconName: 'Video' },
  x: { maxChars: 280, label: 'X (Twitter)', iconName: 'Twitter' },
  youtube: { maxChars: 5000, label: 'YouTube Shorts', iconName: 'Youtube' },
  pinterest: { maxChars: 500, label: 'Pinterest', iconName: 'Pin' },
};

export function getPlatformLimit(platform: string): number {
  const key = platform.toLowerCase();
  return PLATFORM_LIMITS[key]?.maxChars ?? 2000;
}
