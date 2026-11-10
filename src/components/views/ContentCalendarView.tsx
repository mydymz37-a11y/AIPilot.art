import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Search,
  Download,
  List,
  Grid,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentPost, ContentStatus, PlatformType } from '../../types';
import { exportToCSV, downloadCSV } from '../../utils/csv';

export const ContentCalendarView: React.FC = () => {
  const {
    posts,
    campaigns,
    activeBrand,
    createPost,
    updatePost,
    duplicatePost,
    deletePost,
    currentUserRole,
    showToast,
    setCurrentView,
  } = useApp();

  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Date for Month View
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 10, 1)); // Nov 2026

  // Post detail modal
  const [activePost, setActivePost] = useState<ContentPost | null>(null);

  const brandPosts = posts.filter((p) => !activeBrand || p.brandId === activeBrand.id);

  const filteredPosts = brandPosts.filter((p) => {
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hook.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bodyText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    if (filteredPosts.length === 0) {
      showToast('No posts matching criteria to export.', 'warning');
      return;
    }

    const exportRows = filteredPosts.map((p) => ({
      ID: p.id,
      Platform: p.platform.toUpperCase(),
      Title: p.title,
      Hook: p.hook,
      Body: p.bodyText.replace(/\n/g, ' '),
      CTA: p.callToAction,
      Hashtags: p.hashtags.join(' '),
      Status: p.status,
      ScheduledDate: p.scheduledDate || 'Unscheduled',
      ScheduledTime: p.scheduledTime || 'N/A',
      CharacterCount: p.characterCount,
    }));

    const csvData = exportToCSV(exportRows);
    downloadCSV(csvData, `AIPilot-Calendar-${activeBrand?.name || 'Workspace'}.csv`);
    showToast('Exported Content Calendar to CSV!', 'success');
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Published</span>;
      case 'ready_to_publish':
        return <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Ready to Publish</span>;
      case 'approved':
        return <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Approved</span>;
      case 'in_review':
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">In Review</span>;
      case 'draft':
        return <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Draft</span>;
    }
  };

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Module 6: Content Calendar & Publishing Operations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Editorial Content Calendar</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Plan, organize, and inspect your multi-platform publishing schedule with drag-and-drop cadence management and CSV export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 transition-colors"
          >
            <Download className="h-4 w-4 text-indigo-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setCurrentView('content_studio')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>New Post Entry</span>
          </button>
        </div>
      </div>

      {/* Publishing Disclaimer */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 flex items-center gap-3 text-xs text-slate-400">
        <ShieldAlert className="h-4 w-4 text-indigo-400 flex-shrink-0" />
        <div>
          <strong className="text-slate-200">Internal Operational Calendar:</strong> Scheduling dates represent internal editorial targets and review queues. Copy-ready posts and packages can be dispatched once authorized social platform connections are confirmed.
        </div>
      </div>

      {/* Filter and Mode Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl bg-slate-900 border border-slate-800 p-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search calendar..."
            className="w-full rounded-lg bg-slate-800/80 border border-slate-700 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
          >
            <option value="all">All Platforms</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="x">X (Twitter)</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="pinterest">Pinterest</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="ready_to_publish">Ready to Publish</option>
            <option value="published">Published</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('month')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Month or List */}
      {viewMode === 'month' ? (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">{monthName}</h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentMonthDate(new Date())}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold uppercase text-slate-400 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div
                key={`blank-${i}`}
                className="h-28 rounded-xl bg-slate-900/30 border border-slate-800/40 p-2 opacity-30"
              />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayPosts = filteredPosts.filter((p) => p.scheduledDate === dateStr);

              return (
                <div
                  key={`day-${dayNum}`}
                  className="h-28 rounded-xl bg-slate-800/40 border border-slate-700/50 p-2 overflow-y-auto hover:border-slate-600 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">{dayNum}</span>
                    {dayPosts.length > 0 && (
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1 rounded">
                        {dayPosts.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setActivePost(post)}
                        className="rounded p-1 bg-slate-800 text-[10px] font-medium text-slate-200 border border-slate-700/80 hover:border-indigo-500 cursor-pointer truncate"
                      >
                        <span className="font-bold text-indigo-400 uppercase mr-1">
                          {post.platform.slice(0, 2)}
                        </span>
                        <span>{post.title}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto" />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List Table View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Title & Hook</th>
                  <th className="p-3">Scheduled Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {post.platform}
                      </span>
                    </td>
                    <td className="p-3 max-w-md">
                      <div className="font-bold text-white mb-0.5">{post.title}</div>
                      <div className="text-slate-400 line-clamp-1 italic">"{post.hook}"</div>
                    </td>
                    <td className="p-3 whitespace-nowrap text-slate-300">
                      {post.scheduledDate ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {post.scheduledDate} {post.scheduledTime || ''}
                        </span>
                      ) : (
                        <span className="text-slate-500">Unscheduled</span>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">{getStatusBadge(post.status)}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActivePost(post)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => duplicatePost(post.id)}
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title="Duplicate"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {currentUserRole !== 'viewer' && (
                          <button
                            onClick={() => deletePost(post.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post Detail & Reschedule Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {activePost.platform}
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-[300px]">
                  {activePost.title}
                </h3>
              </div>
              <button onClick={() => setActivePost(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs mb-5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Hook</div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 text-white font-semibold">
                  "{activePost.hook}"
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Body Text</div>
                <div className="p-3 rounded-lg bg-slate-800/50 text-slate-200 whitespace-pre-line leading-relaxed">
                  {activePost.bodyText}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Call to Action</div>
                <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 font-medium">
                  {activePost.callToAction}
                </div>
              </div>

              {/* Reschedule controls */}
              <div className="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Reschedule Publication Date</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={activePost.scheduledDate || ''}
                    onChange={(e) =>
                      setActivePost({ ...activePost, scheduledDate: e.target.value })
                    }
                    className="rounded-lg bg-slate-900 border border-slate-700 p-2 text-white text-xs"
                  />
                  <input
                    type="time"
                    value={activePost.scheduledTime || '10:00'}
                    onChange={(e) =>
                      setActivePost({ ...activePost, scheduledTime: e.target.value })
                    }
                    className="rounded-lg bg-slate-900 border border-slate-700 p-2 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${activePost.hook}\n\n${activePost.bodyText}\n\n${activePost.callToAction}\n\n${activePost.hashtags.join(' ')}`
                  );
                  showToast('Post copied to clipboard!', 'success');
                }}
                className="text-xs font-semibold text-slate-300 hover:text-white"
              >
                Copy Content
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePost(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    updatePost(activePost.id, {
                      scheduledDate: activePost.scheduledDate,
                      scheduledTime: activePost.scheduledTime,
                    });
                    setActivePost(null);
                    showToast('Publication schedule updated!', 'success');
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
