import React, { useState } from 'react';
import {
  CheckSquare,
  Check,
  X,
  MessageSquare,
  Clock,
  Send,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentPost } from '../../types';

export const ApprovalsView: React.FC = () => {
  const {
    posts,
    activeBrand,
    updatePostApproval,
    addReviewComment,
    currentUserRole,
    showToast,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  const brandPosts = posts.filter((p) => !activeBrand || p.brandId === activeBrand.id);

  const pendingPosts = brandPosts.filter(
    (p) => p.approvalStatus === 'pending' || p.status === 'in_review'
  );
  const approvedPosts = brandPosts.filter(
    (p) => p.approvalStatus === 'approved' || p.status === 'approved'
  );

  const displayedPosts =
    filterTab === 'pending'
      ? pendingPosts
      : filterTab === 'approved'
      ? approvedPosts
      : brandPosts;

  const handleSendComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;
    addReviewComment(postId, text.trim());
    setCommentInput({ ...commentInput, [postId]: '' });
  };

  const isReviewer = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Workspace: Content Approvals & Editorial Queue</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Editorial Review & Client Sign-Off
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Ensure brand safety before publication. Editors draft content, while Admins, Owners, and Client Reviewers approve, comment, or request revisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Your Current Authority:</span>
          <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
            {currentUserRole}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setFilterTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterTab === 'pending'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <span>Pending Review</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {pendingPosts.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <span>Approved Posts</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {approvedPosts.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterTab === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <span>All Portfolio Posts ({brandPosts.length})</span>
        </button>
      </div>

      {/* Posts Queue */}
      {displayedPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <CheckSquare className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-white">No items in this queue</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            All submitted content posts have been signed off or no drafts are currently pending.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {displayedPosts.map((post) => {
            const isApproved = post.approvalStatus === 'approved';
            const isPending = post.approvalStatus === 'pending' || post.status === 'in_review';

            return (
              <div
                key={post.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {post.platform}
                    </span>
                    <h3 className="text-base font-bold text-white">{post.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.scheduledDate && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" />
                        Target: {post.scheduledDate} {post.scheduledTime || ''}
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isPending
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {post.approvalStatus || post.status}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: Hook & Body (8 cols) */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                        Hook
                      </div>
                      <div className="text-xs font-bold text-white leading-snug">
                        "{post.hook}"
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                      {post.bodyText}
                    </div>

                    {post.callToAction && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
                        <strong>CTA: </strong>
                        {post.callToAction}
                      </div>
                    )}
                  </div>

                  {/* Right: Review Comments & Approver Decision (4 cols) */}
                  <div className="md:col-span-4 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-3">
                        <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Review Thread ({post.reviewerComments?.length || 0})</span>
                      </div>

                      {/* Comments list */}
                      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                        {!post.reviewerComments || post.reviewerComments.length === 0 ? (
                          <div className="text-[11px] text-slate-500 italic">
                            No review notes yet. Leave feedback below.
                          </div>
                        ) : (
                          post.reviewerComments.map((comm) => (
                            <div key={comm.id} className="p-2 rounded-lg bg-slate-800 text-xs">
                              <div className="flex items-center justify-between text-[10px] text-indigo-400 font-semibold mb-0.5">
                                <span>{comm.author}</span>
                                <span className="text-slate-500">{comm.date}</span>
                              </div>
                              <p className="text-[11px] text-slate-300">{comm.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment input */}
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={commentInput[post.id] || ''}
                          onChange={(e) =>
                            setCommentInput({ ...commentInput, [post.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendComment(post.id);
                          }}
                          placeholder="Type review note..."
                          className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() => handleSendComment(post.id)}
                          className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                        >
                          <Send className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Approver Sign-off Buttons */}
                    <div className="pt-4 border-t border-slate-700/60 mt-4 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Sign-Off Decision
                      </div>

                      {isReviewer ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updatePostApproval(post.id, 'approved')}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => updatePostApproval(post.id, 'needs_revision')}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 py-2 text-xs font-bold text-white shadow-md shadow-amber-600/20"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Revise</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">
                          (Role '{currentUserRole}' cannot approve. Switch to Admin or Owner in the sidebar to simulate approval.)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
