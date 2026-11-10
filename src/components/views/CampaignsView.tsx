import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Copy,
  Archive,
  Trash2,
  Edit,
  TrendingUp,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Campaign, CampaignStatus, PlatformType } from '../../types';

export const CampaignsView: React.FC = () => {
  const {
    campaigns,
    createCampaign,
    updateCampaign,
    duplicateCampaign,
    deleteCampaign,
    activeBrand,
    setCurrentView,
    currentUserRole,
    showToast,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Campaign | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Campaign | null>(null);

  // Form State for Create/Edit
  const [formName, setFormName] = useState('');
  const [formObjective, setFormObjective] = useState('Lead Generation');
  const [formAudience, setFormAudience] = useState('');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [formPlatforms, setFormPlatforms] = useState<PlatformType[]>(['linkedin', 'x']);
  const [formBudget, setFormBudget] = useState('2500');
  const [formStatus, setFormStatus] = useState<CampaignStatus>('planning');

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesBrand = !activeBrand || c.brandId === activeBrand.id;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesStatus && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingCamp(null);
    setFormName('');
    setFormObjective('Lead Generation');
    setFormAudience(activeBrand?.targetAudience || 'Modern Tech Decision Makers');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setFormPlatforms(['linkedin', 'x']);
    setFormBudget('3000');
    setFormStatus('planning');
    setModalOpen(true);
  };

  const openEditModal = (camp: Campaign) => {
    setEditingCamp(camp);
    setFormName(camp.name);
    setFormObjective(camp.objective);
    setFormAudience(camp.targetAudience);
    setFormStartDate(camp.startDate);
    setFormEndDate(camp.endDate);
    setFormPlatforms(camp.targetPlatforms);
    setFormBudget(camp.budget.toString());
    setFormStatus(camp.status);
    setModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a campaign name.', 'warning');
      return;
    }

    const budgetNum = parseFloat(formBudget) || 0;

    if (editingCamp) {
      updateCampaign(editingCamp.id, {
        name: formName,
        objective: formObjective,
        targetAudience: formAudience,
        startDate: formStartDate,
        endDate: formEndDate,
        targetPlatforms: formPlatforms,
        budget: budgetNum,
        status: formStatus,
      });
    } else {
      createCampaign({
        brandId: activeBrand?.id || 'brand-1',
        name: formName,
        objective: formObjective,
        targetAudience: formAudience,
        startDate: formStartDate,
        endDate: formEndDate,
        targetPlatforms: formPlatforms,
        budget: budgetNum,
        spent: 0,
        status: formStatus,
        performance: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
      });
    }
    setModalOpen(false);
  };

  const togglePlatform = (p: PlatformType) => {
    if (formPlatforms.includes(p)) {
      if (formPlatforms.length > 1) {
        setFormPlatforms(formPlatforms.filter((x) => x !== p));
      }
    } else {
      setFormPlatforms([...formPlatforms, p]);
    }
  };

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'active':
        return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>;
      case 'planning':
        return <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Planning</span>;
      case 'paused':
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Paused</span>;
      case 'completed':
        return <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Completed</span>;
      case 'archived':
        return <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Megaphone className="h-3.5 w-3.5" />
            <span>Module 3: Campaign Operations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Campaign Management</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Organize multi-channel marketing initiatives, set budgets, track live conversions, and orchestrate campaigns.
          </p>
        </div>

        {currentUserRole !== 'viewer' && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Campaign</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl bg-slate-900 border border-slate-800 p-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by name or objective..."
            className="w-full rounded-lg bg-slate-800/80 border border-slate-700 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['all', 'active', 'planning', 'paused', 'completed', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign List */}
      {filteredCampaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <Megaphone className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-white">No campaigns found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search or filter criteria.'
              : 'Launch your first campaign or convert an AI Strategy into a campaign!'}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={openCreateModal}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
            >
              + Create Campaign
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((camp) => {
            const spentPercent =
              camp.budget > 0 ? Math.min(100, Math.round((camp.spent / camp.budget) * 100)) : 0;
            const roas =
              camp.spent > 0 ? (camp.performance.revenue / camp.spent).toFixed(1) : '0.0';

            return (
              <div
                key={camp.id}
                className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {getStatusBadge(camp.status)}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateCampaign(camp.id)}
                        title="Duplicate Campaign"
                        className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-white"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {currentUserRole !== 'viewer' && (
                        <>
                          <button
                            onClick={() => openEditModal(camp)}
                            title="Edit Campaign"
                            className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-white"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              updateCampaign(camp.id, {
                                status: camp.status === 'archived' ? 'active' : 'archived',
                              })
                            }
                            title={camp.status === 'archived' ? 'Unarchive' : 'Archive'}
                            className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-amber-400"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(camp)}
                            title="Delete Campaign"
                            className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight mb-1">
                    {camp.name}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-400 mb-2">
                    {camp.objective}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    Audience: {camp.targetAudience}
                  </p>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {camp.targetPlatforms.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Budget & Spend Meter */}
                  <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40 mb-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                      <span>Spent: ${camp.spent.toLocaleString()}</span>
                      <span>Budget: ${camp.budget.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                        style={{ width: `${spentPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics snippet */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-800/80 pt-3">
                    <div>
                      <div className="text-[10px] text-slate-400">Impressions</div>
                      <div className="font-bold text-white">
                        {camp.performance.impressions.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Conversions</div>
                      <div className="font-bold text-emerald-400">
                        {camp.performance.conversions}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">ROAS</div>
                      <div className="font-bold text-cyan-400">{roas}x</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {camp.startDate} to {camp.endDate}
                  </span>
                  <button
                    onClick={() => setCurrentView('content_studio')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
                  >
                    <span>+ Content</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Campaign Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingCamp ? 'Edit Campaign' : 'Create New Campaign'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Q4 Executive Inbound Masterclass"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Objective
                  </label>
                  <select
                    value={formObjective}
                    onChange={(e) => setFormObjective(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Website Traffic">Website Traffic</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Product Sales">Product Sales</option>
                    <option value="Customer Retention">Customer Retention</option>
                    <option value="Product Launch">Product Launch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CampaignStatus)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value)}
                  placeholder="e.g. B2B Sales Executives & Founders"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Budget ($)
                </label>
                <input
                  type="number"
                  value={formBudget}
                  onChange={(e) => setFormBudget(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['linkedin', 'instagram', 'x', 'facebook', 'tiktok', 'youtube', 'pinterest'] as PlatformType[]).map(
                    (p) => {
                      const active = formPlatforms.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => togglePlatform(p)}
                          className={`px-3 py-1 text-xs rounded-lg uppercase font-bold border transition-colors ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {editingCamp ? 'Save Changes' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete Campaign?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you sure you want to delete{' '}
              <strong className="text-white">"{deleteCandidate.name}"</strong>? This will permanently
              remove associated KPIs and budget tracking.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCampaign(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
