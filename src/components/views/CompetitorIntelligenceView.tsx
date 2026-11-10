import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  ExternalLink,
  Upload,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Competitor, CompetitorAnalysis } from '../../types';
import { parseCSV } from '../../utils/csv';

export const CompetitorIntelligenceView: React.FC = () => {
  const {
    activeBrand,
    competitors,
    createCompetitor,
    updateCompetitor,
    deleteCompetitor,
    consumeCredit,
    showToast,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Competitor | null>(null);
  const [analyzingCompId, setAnalyzingCompId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<{
    competitorName: string;
    analysis: CompetitorAnalysis;
  } | null>(null);

  // Form
  const [compName, setCompName] = useState('');
  const [compWebsite, setCompWebsite] = useState('https://');
  const [compPositioning, setCompPositioning] = useState('');
  const [compAudience, setCompAudience] = useState('');
  const [compOffer, setCompOffer] = useState('');
  const [compExamples, setCompExamples] = useState('');
  const [compNotes, setCompNotes] = useState('');

  const brandCompetitors = competitors.filter(
    (c) => !activeBrand || c.brandId === activeBrand.id
  );

  const openCreateModal = () => {
    setEditingComp(null);
    setCompName('');
    setCompWebsite('https://');
    setCompPositioning('');
    setCompAudience('');
    setCompOffer('');
    setCompExamples('');
    setCompNotes('');
    setModalOpen(true);
  };

  const handleSaveCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) {
      showToast('Please enter competitor name', 'warning');
      return;
    }

    const payload = {
      brandId: activeBrand?.id || 'brand-1',
      name: compName,
      websiteUrl: compWebsite,
      positioning: compPositioning,
      targetAudience: compAudience,
      offerSummary: compOffer,
      marketingExamples: compExamples.split(',').map((s) => s.trim()).filter(Boolean),
      notes: compNotes,
    };

    if (editingComp) {
      updateCompetitor(editingComp.id, payload);
    } else {
      createCompetitor(payload);
    }
    setModalOpen(false);
  };

  const handleRunAiAnalysis = async (comp: Competitor) => {
    if (!consumeCredit(4)) return;

    setAnalyzingCompId(comp.id);
    showToast(`Analyzing market gaps between ${activeBrand?.name} and ${comp.name}...`, 'info');

    try {
      const res = await fetch('/api/ai/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: activeBrand,
          competitor: comp,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        updateCompetitor(comp.id, { aiAnalysis: data.analysis });
        setActiveAnalysis({ competitorName: comp.name, analysis: data.analysis });
        showToast(`Strategic analysis complete for ${comp.name}!`, 'success');
      }
    } catch {
      showToast('Could not complete competitor analysis.', 'error');
    } finally {
      setAnalyzingCompId(null);
    }
  };

  // CSV Import for competitors
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const rows = parseCSV(text);
        let imported = 0;
        rows.forEach((r) => {
          if (r.Name || r.name || r.Competitor) {
            createCompetitor({
              brandId: activeBrand?.id || 'brand-1',
              name: r.Name || r.name || r.Competitor || 'Unknown Competitor',
              websiteUrl: r.Website || r.website || 'https://',
              positioning: r.Positioning || r.positioning || 'Market alternative',
              targetAudience: r.Audience || r.audience || 'Target buyers',
              offerSummary: r.Offer || r.offer || 'Standard subscription',
              marketingExamples: [r.Notes || r.notes || 'Imported via CSV'],
              notes: 'Imported via CSV research batch.',
            });
            imported++;
          }
        });
        showToast(`Imported ${imported} competitor records from CSV!`, 'success');
      } catch {
        showToast('Failed to parse competitor CSV file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Search className="h-3.5 w-3.5" />
            <span>Module 8: Competitor Intelligence & Market Gap Analysis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Competitor Intelligence</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Audit competitor positioning, unearth messaging opportunities, evaluate pricing offers, and generate counter-campaign strategies based on real data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 cursor-pointer transition-colors">
            <Upload className="h-4 w-4 text-indigo-400" />
            <span>Import CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Competitor</span>
          </button>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {brandCompetitors.map((comp) => {
          const isAnalyzing = analyzingCompId === comp.id;
          const hasAnalysis = Boolean(comp.aiAnalysis);

          return (
            <div
              key={comp.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>{comp.name}</span>
                      {comp.websiteUrl && (
                        <a
                          href={comp.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-indigo-400"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </h3>
                    <div className="text-xs text-indigo-400 font-semibold mt-0.5">
                      {comp.positioning}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteCompetitor(comp.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 mb-4">
                  <div>
                    <strong className="text-slate-400 block mb-0.5">Target Audience:</strong>
                    <span>{comp.targetAudience}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block mb-0.5">Current Offer / Model:</strong>
                    <span>{comp.offerSummary}</span>
                  </div>
                  {comp.notes && (
                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-400">
                      <strong className="text-slate-300">Audited Observations: </strong>
                      {comp.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Trigger or View */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {hasAnalysis ? (
                  <button
                    onClick={() =>
                      setActiveAnalysis({
                        competitorName: comp.name,
                        analysis: comp.aiAnalysis!,
                      })
                    }
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>View Market Gap Analysis</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500">Not analyzed yet</span>
                )}

                <button
                  onClick={() => handleRunAiAnalysis(comp)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{hasAnalysis ? 'Re-Analyze Gap' : 'Run Gap Analysis'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Gap Analysis Modal / Drawer */}
      {activeAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Strategic Teardown vs {activeAnalysis.competitorName}
                </h3>
                <p className="text-xs text-indigo-400">
                  Benchmarked directly against {activeBrand?.name}
                </p>
              </div>
              <button
                onClick={() => setActiveAnalysis(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Positioning Differences */}
              <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
                <div className="font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Positioning Wedge & Differences
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {activeAnalysis.analysis.positioningDifferences}
                </p>
              </div>

              {/* Messaging Opportunities */}
              <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
                <div className="font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  Uncontested Messaging Opportunities
                </div>
                <ul className="space-y-1.5">
                  {activeAnalysis.analysis.messagingOpportunities.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Market Gaps & Voids */}
              <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
                <div className="font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Unaddressed Market Gaps
                </div>
                <ul className="space-y-1.5">
                  {activeAnalysis.analysis.marketGaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Content Angles */}
              <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
                <div className="font-bold text-emerald-300 uppercase tracking-wider mb-2">
                  Recommended Counter-Content Ideas
                </div>
                <ul className="space-y-1.5">
                  {activeAnalysis.analysis.recommendedContentIdeas.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-200 font-medium">
                      <span className="text-emerald-400 font-bold">🎯</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveAnalysis(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Competitor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Add Competitor Profile</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompetitor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Competitor Name *</label>
                <input
                  type="text"
                  required
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="e.g. Clari"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Website URL</label>
                <input
                  type="text"
                  value={compWebsite}
                  onChange={(e) => setCompWebsite(e.target.value)}
                  placeholder="https://competitor.com"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Their Stated Positioning</label>
                <input
                  type="text"
                  value={compPositioning}
                  onChange={(e) => setCompPositioning(e.target.value)}
                  placeholder="e.g. Enterprise Revenue Operations Platform"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Their Target Audience</label>
                <input
                  type="text"
                  value={compAudience}
                  onChange={(e) => setCompAudience(e.target.value)}
                  placeholder="e.g. Fortune 500 Enterprise IT & CROs"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Observed Weaknesses / Notes</label>
                <textarea
                  rows={2}
                  value={compNotes}
                  onChange={(e) => setCompNotes(e.target.value)}
                  placeholder="e.g. Long 6-month deployment, high implementation fees..."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
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
                  Save Competitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
