import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  Upload,
  Plus,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PerformanceRecord, GrowthAnalysisResult } from '../../types';
import {
  calculateCTR,
  calculateCVR,
  calculateCPA,
  calculateCPC,
  calculateROAS,
  calculateAllMetrics,
} from '../../utils/metrics';
import { exportToCSV, parseCSV, downloadCSV } from '../../utils/csv';

export const AnalyticsGrowthView: React.FC = () => {
  const {
    activeBrand,
    performanceRecords,
    addPerformanceRecord,
    importPerformanceRecords,
    consumeCredit,
    showToast,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [growthResult, setGrowthResult] = useState<GrowthAnalysisResult | null>(null);

  // Manual record form
  const [formCampaign, setFormCampaign] = useState('Q4 Inbound Masterclass');
  const [formChannel, setFormChannel] = useState('LinkedIn Ads');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formSpend, setFormSpend] = useState('450');
  const [formImpressions, setFormImpressions] = useState('8500');
  const [formClicks, setFormClicks] = useState('320');
  const [formLeads, setFormLeads] = useState('24');
  const [formConversions, setFormConversions] = useState('16');
  const [formRevenue, setFormRevenue] = useState('2400');
  const [formNotes, setFormNotes] = useState('High-converting executive carousel');

  const brandRecords = performanceRecords.filter(
    (r) => !activeBrand || r.brandId === activeBrand.id
  );

  // Aggregate totals
  const totalSpend = brandRecords.reduce((acc, r) => acc + (r.spend || 0), 0);
  const totalImpressions = brandRecords.reduce((acc, r) => acc + (r.impressions || 0), 0);
  const totalClicks = brandRecords.reduce((acc, r) => acc + (r.clicks || 0), 0);
  const totalLeads = brandRecords.reduce((acc, r) => acc + (r.leads || 0), 0);
  const totalConversions = brandRecords.reduce((acc, r) => acc + (r.conversions || 0), 0);
  const totalRevenue = brandRecords.reduce((acc, r) => acc + (r.revenue || 0), 0);

  const metrics = calculateAllMetrics({
    spend: totalSpend,
    impressions: totalImpressions,
    clicks: totalClicks,
    leads: totalLeads,
    conversions: totalConversions,
    revenue: totalRevenue,
  });

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    addPerformanceRecord({
      brandId: activeBrand?.id || 'brand-1',
      campaignName: formCampaign,
      channel: formChannel,
      date: formDate,
      spend: parseFloat(formSpend) || 0,
      impressions: parseInt(formImpressions, 10) || 0,
      reach: Math.round((parseInt(formImpressions, 10) || 0) * 0.8),
      clicks: parseInt(formClicks, 10) || 0,
      leads: parseInt(formLeads, 10) || 0,
      conversions: parseInt(formConversions, 10) || 0,
      revenue: parseFloat(formRevenue) || 0,
      notes: formNotes,
    });
    setModalOpen(false);
  };

  const handleExportCSV = () => {
    if (brandRecords.length === 0) {
      showToast('No telemetry records to export.', 'warning');
      return;
    }
    const exportData = brandRecords.map((r) => ({
      Date: r.date,
      Campaign: r.campaignName,
      Channel: r.channel,
      Spend: r.spend,
      Impressions: r.impressions,
      Clicks: r.clicks,
      CTR: `${calculateCTR(r.clicks, r.impressions)}%`,
      Leads: r.leads,
      Conversions: r.conversions,
      CVR: `${calculateCVR(r.conversions, r.clicks)}%`,
      CPA: `$${calculateCPA(r.spend, r.conversions)}`,
      Revenue: r.revenue,
      ROAS: `${calculateROAS(r.revenue, r.spend)}x`,
      Notes: r.notes || '',
    }));

    const csvStr = exportToCSV(exportData);
    downloadCSV(csvStr, `AIPilot-Performance-${activeBrand?.name || 'Telemetry'}.csv`);
    showToast('Exported marketing performance data to CSV!', 'success');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const rows = parseCSV(text);
        const parsedRecords = rows.map((r) => ({
          brandId: activeBrand?.id || 'brand-1',
          campaignName: r.Campaign || r.campaign || 'Imported Campaign',
          channel: r.Channel || r.channel || 'Paid Ad',
          date: r.Date || r.date || new Date().toISOString().split('T')[0],
          spend: parseFloat(r.Spend || r.spend || '0') || 0,
          impressions: parseInt(r.Impressions || r.impressions || '0', 10) || 0,
          reach: parseInt(r.Reach || r.reach || '0', 10) || 0,
          clicks: parseInt(r.Clicks || r.clicks || '0', 10) || 0,
          leads: parseInt(r.Leads || r.leads || '0', 10) || 0,
          conversions: parseInt(r.Conversions || r.conversions || '0', 10) || 0,
          revenue: parseFloat(r.Revenue || r.revenue || '0') || 0,
          notes: r.Notes || r.notes || 'Imported via CSV file',
        }));

        if (parsedRecords.length > 0) {
          importPerformanceRecords(parsedRecords);
        } else {
          showToast('No valid records found in CSV.', 'warning');
        }
      } catch {
        showToast('Error parsing performance CSV.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleRunGrowthAnalyst = async () => {
    if (!consumeCredit(4)) return;

    setIsAnalyzing(true);
    showToast('AI Growth Analyst is evaluating performance telemetry...', 'info');

    try {
      const res = await fetch('/api/ai/growth-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: activeBrand,
          metricsData: brandRecords,
          timeRange: 'Last 30 Days',
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setGrowthResult(data.analysis);
        showToast('AI Growth Analysis generated from live telemetry!', 'success');
      }
    } catch {
      showToast('Could not complete growth analysis.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400 mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Module 9: Analytics & AI Growth Analyst</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Performance Telemetry & Growth Engine
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real mathematical telemetry: CTR, CVR, CPA, ROAS, and profit. Analyze stored records with our AI Growth Analyst to discover budget reallocation opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition-colors"
          >
            <Download className="h-4 w-4 text-indigo-400" />
            <span>Export CSV</span>
          </button>

          <label className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 cursor-pointer transition-colors">
            <Upload className="h-4 w-4 text-indigo-400" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Log Metric Row</span>
          </button>
        </div>
      </div>

      {/* Calculated KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Ad Spend
          </div>
          <div className="text-xl font-black text-white">${totalSpend.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-1">Manual & Imported</div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Revenue
          </div>
          <div className="text-xl font-black text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1">
            Profit: ${metrics.profit.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Blended ROAS
          </div>
          <div className="text-xl font-black text-cyan-400">
            {metrics.roas > 0 ? `${metrics.roas}x` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Revenue / Spend</div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Click-Through (CTR)
          </div>
          <div className="text-xl font-black text-indigo-400">
            {metrics.ctr > 0 ? `${metrics.ctr}%` : '0%'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {totalClicks.toLocaleString()} Clicks
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Conversion Rate (CVR)
          </div>
          <div className="text-xl font-black text-violet-400">
            {metrics.cvr > 0 ? `${metrics.cvr}%` : '0%'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {totalConversions} Conversions
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Cost Per Acq (CPA)
          </div>
          <div className="text-xl font-black text-white">
            {metrics.cpa > 0 ? `$${metrics.cpa}` : '$0.00'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Spend / Conversions</div>
        </div>
      </div>

      {/* AI Growth Analyst Action Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              AI Growth Analyst Teardown
            </h3>
            <p className="text-xs text-slate-300">
              Run statistical analysis on your {brandRecords.length} stored campaign telemetry rows to spot bottlenecks and budget reallocation opportunities.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunGrowthAnalyst}
          disabled={isAnalyzing}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Diagnosing Funnel...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Run AI Growth Analyst</span>
            </>
          )}
        </button>
      </div>

      {/* Growth Analysis Results (if generated) */}
      {growthResult && (
        <div className="rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 space-y-5 shadow-2xl animate-in fade-in duration-300">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Live AI Growth Teardown
            </span>
            <h3 className="text-base font-extrabold text-white mt-1">
              Executive Performance Assessment
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {growthResult.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strongest Channels */}
            <div className="rounded-xl bg-slate-800/60 border border-emerald-500/30 p-4 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4" />
                <span>Strongest Converting Channels</span>
              </div>
              {growthResult.strongestChannels.map((c, i) => (
                <div key={i} className="text-xs p-2 rounded bg-slate-800/80">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{c.channel}</span>
                    <span className="text-emerald-400">{c.metricHighlight}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{c.reason}</p>
                </div>
              ))}
            </div>

            {/* Weakest Channels */}
            <div className="rounded-xl bg-slate-800/60 border border-rose-500/30 p-4 space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowDownRight className="h-4 w-4" />
                <span>Weakest Channels & Leakage</span>
              </div>
              {growthResult.weakestChannels.map((c, i) => (
                <div key={i} className="text-xs p-2 rounded bg-slate-800/80">
                  <div className="font-bold text-rose-300">{c.channel}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{c.issue}</p>
                  <p className="text-[11px] text-indigo-300 font-medium mt-1">
                    Fix: {c.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Reallocation Recommendation */}
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/30 p-4 text-xs">
            <strong className="text-indigo-300 block mb-1">
              Recommended Budget Reallocation:
            </strong>
            <p className="text-slate-200 leading-relaxed font-medium">
              {growthResult.recommendedBudgetReallocation}
            </p>
          </div>
        </div>
      )}

      {/* Telemetry Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <span>Telemetry Records ({brandRecords.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Clearly labeled: Real logged or imported data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Campaign</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Spend</th>
                <th className="p-3">Impressions</th>
                <th className="p-3">Clicks</th>
                <th className="p-3">CTR</th>
                <th className="p-3">Conversions</th>
                <th className="p-3">CPA</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {brandRecords.map((r) => {
                const ctr = calculateCTR(r.clicks, r.impressions);
                const cpa = calculateCPA(r.spend, r.conversions);
                const roas = calculateROAS(r.revenue, r.spend);

                return (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="p-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {r.date}
                    </td>
                    <td className="p-3 font-semibold text-white whitespace-nowrap">
                      {r.campaignName}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {r.channel}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-200">${r.spend}</td>
                    <td className="p-3 text-slate-300 font-mono text-[11px]">
                      {r.impressions.toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-300 font-mono text-[11px]">{r.clicks}</td>
                    <td className="p-3 font-bold text-indigo-400">{ctr}%</td>
                    <td className="p-3 font-bold text-emerald-400">{r.conversions}</td>
                    <td className="p-3 text-slate-200">${cpa}</td>
                    <td className="p-3 font-semibold text-slate-200">${r.revenue}</td>
                    <td className="p-3 font-bold text-cyan-400">{roas}x</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Log Marketing Telemetry Row</h3>
            <form onSubmit={handleSaveRecord} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Campaign</label>
                  <input
                    type="text"
                    required
                    value={formCampaign}
                    onChange={(e) => setFormCampaign(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Channel</label>
                  <input
                    type="text"
                    required
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Spend ($)</label>
                  <input
                    type="number"
                    value={formSpend}
                    onChange={(e) => setFormSpend(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Revenue ($)</label>
                  <input
                    type="number"
                    value={formRevenue}
                    onChange={(e) => setFormRevenue(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Impressions</label>
                  <input
                    type="number"
                    value={formImpressions}
                    onChange={(e) => setFormImpressions(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Clicks</label>
                  <input
                    type="number"
                    value={formClicks}
                    onChange={(e) => setFormClicks(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Leads</label>
                  <input
                    type="number"
                    value={formLeads}
                    onChange={(e) => setFormLeads(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Conversions</label>
                  <input
                    type="number"
                    value={formConversions}
                    onChange={(e) => setFormConversions(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
