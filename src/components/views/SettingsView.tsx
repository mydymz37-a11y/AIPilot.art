import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Sparkles,
  Download,
  RotateCcw,
  Key,
  Globe,
  Bell,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    activeBrand,
    exportAllDataAsJSON,
    resetToDemoData,
    showToast,
  } = useApp();

  const [userName, setUserName] = useState('Alexander Vance');
  const [userEmail, setUserEmail] = useState('alexander@nexusflow.io');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [aiCreativity, setAiCreativity] = useState('0.7');
  const [systemModel, setSystemModel] = useState('gemini-3.8-flash');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('User profile preferences saved.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
          <SettingsIcon className="h-3.5 w-3.5" />
          <span>Account & Workspace Settings</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">Platform Preferences</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Configure profile details, multi-factor security, AI generation parameters, and workspace backup archives.
        </p>
      </div>

      {/* User Profile Form */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Profile Details</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 text-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Account Security */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Account Security & Authentication</h3>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div>
            <div className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Secure your marketing operations and client assets with biometric / authenticator app verification.
            </p>
          </div>
          <button
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              showToast(`2FA is now ${!twoFactorEnabled ? 'Enabled' : 'Disabled'}`, 'info');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              twoFactorEnabled
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {twoFactorEnabled ? '2FA Active' : 'Enable 2FA'}
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div>
            <div className="text-xs font-bold text-white">Realtime Approval Notifications</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Receive alerts when an editor submits content for client or admin review.
            </p>
          </div>
          <button
            onClick={() => {
              setEmailNotifications(!emailNotifications);
              showToast('Notification preference updated.', 'info');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              emailNotifications
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {emailNotifications ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* AI Engine Configuration */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">AI Engine & Model Tuning</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Active Server-Side AI Model
            </label>
            <input
              type="text"
              readOnly
              value={systemModel}
              className="w-full rounded-xl bg-slate-800/60 border border-slate-700 px-3.5 py-2 text-indigo-300 font-mono focus:outline-none cursor-default"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Calls are proxied via full-stack Express backend with telemetry headers.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Creativity / Temperature Profile
            </label>
            <select
              value={aiCreativity}
              onChange={(e) => setAiCreativity(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="0.4">Precise & Benchmark Focused (0.4)</option>
              <option value="0.7">Balanced SaaS Marketing (0.7 - Recommended)</option>
              <option value="0.9">High Creative Hook Divergence (0.9)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Export & Reset */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
          Workspace Backups & Reset
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-white">Export Complete Workspace JSON</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Download an offline backup file containing all brand profiles, campaigns, content drafts, competitors, and telemetry records.
            </p>
          </div>
          <button
            onClick={exportAllDataAsJSON}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition-colors whitespace-nowrap"
          >
            <Download className="h-4 w-4 text-indigo-400" />
            <span>Download Backup</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div>
            <div className="text-xs font-bold text-rose-400">Reset to Full Demo Dataset</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Restore the original enterprise seed data (NexusFlow, Lumina Living, campaigns, and metrics).
            </p>
          </div>
          <button
            onClick={resetToDemoData}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 px-4 py-2 text-xs font-bold text-rose-300 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
