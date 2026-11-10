import React, { useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  Trash2,
  Mail,
  CheckCircle2,
  Lock,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeamMember, UserRole } from '../../types';

export const TeamClientsView: React.FC = () => {
  const {
    teamMembers,
    addTeamMember,
    updateTeamMemberRole,
    removeTeamMember,
    currentUserRole,
    setCurrentUserRole,
    activeBrand,
    showToast,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('editor');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Please provide member name and email.', 'warning');
      return;
    }

    addTeamMember({
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    });

    setModalOpen(false);
    setName('');
    setEmail('');
  };

  const rolePermissions: Record<UserRole, { label: string; desc: string; perms: string[] }> = {
    owner: {
      label: 'Owner',
      desc: 'Full workspace authority, billing control, brand creation, and team role assignment.',
      perms: ['Manage Billing & Plans', 'Create & Delete Brands', 'Approve Content', 'Execute Autopilot', 'Invite Members'],
    },
    admin: {
      label: 'Admin',
      desc: 'High-level campaign director. Can approve drafts, manage strategy blueprints, and view analytics.',
      perms: ['Approve Content', 'Create Campaigns', 'Generate Strategies', 'Invite Editors & Viewers'],
    },
    editor: {
      label: 'Editor',
      desc: 'Creative copywriter and marketer. Can generate posts, edit drafts, and submit to review.',
      perms: ['Draft Posts', 'Run One-to-Many Engine', 'Propose Calendar Schedule', 'Submit Approvals'],
    },
    viewer: {
      label: 'Viewer / Client',
      desc: 'Read-only stakeholder. Can review live dashboards, inspect calendar, and leave feedback comments.',
      perms: ['View Dashboards & Analytics', 'Leave Review Comments', 'Inspect Content Calendar'],
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Users className="h-3.5 w-3.5" />
            <span>Workspace: Team Members & Client Access Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Agency & Team Access</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Manage agency collaborators and client stakeholders with granular Role-Based Access Control (RBAC).
          </p>
        </div>

        {currentUserRole === 'owner' || currentUserRole === 'admin' ? (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Invite Team Member</span>
          </button>
        ) : null}
      </div>

      {/* Role Permissions Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['owner', 'admin', 'editor', 'viewer'] as UserRole[]).map((r) => {
          const info = rolePermissions[r];
          const isCurrent = currentUserRole === r;

          return (
            <div
              key={r}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/30 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                    {info.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                      Active You
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{info.desc}</p>
                <div className="space-y-1 text-[11px]">
                  {info.perms.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!isCurrent && (
                <button
                  onClick={() => setCurrentUserRole(r)}
                  className="mt-4 w-full rounded-lg bg-slate-800 hover:bg-slate-700 py-1.5 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Simulate as {info.label}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Team Roster Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <span>Workspace Members ({teamMembers.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Authorized for {activeBrand?.name}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Member</th>
                <th className="p-3">Email</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {teamMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="h-8 w-8 rounded-full object-cover border border-slate-700"
                    />
                    <span className="font-bold text-white">{m.name}</span>
                  </td>
                  <td className="p-3 text-slate-300 font-mono text-[11px]">{m.email}</td>
                  <td className="p-3">
                    <select
                      value={m.role}
                      disabled={currentUserRole !== 'owner'}
                      onChange={(e) => updateTeamMemberRole(m.id, e.target.value as UserRole)}
                      className="rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-xs font-bold text-indigo-300 capitalize disabled:opacity-60"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{m.joinedAt}</td>
                  <td className="p-3 text-right">
                    {currentUserRole === 'owner' && m.role !== 'owner' && (
                      <button
                        onClick={() => removeTeamMember(m.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@company.com"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role & Authority</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                >
                  <option value="admin">Admin (Campaign & Approval Access)</option>
                  <option value="editor">Editor (Drafting & Content Creation)</option>
                  <option value="viewer">Viewer (Client Stakeholder Read-Only)</option>
                </select>
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
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
