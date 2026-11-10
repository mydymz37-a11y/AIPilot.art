import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Copy,
  Check,
  Filter,
  Tag,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';

export const MediaLibraryView: React.FC = () => {
  const {
    mediaItems,
    addMediaItem,
    deleteMediaItem,
    activeBrand,
    currentUserRole,
    showToast,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'logo' | 'product' | 'lifestyle' | 'creative' | 'ad_asset'>('product');
  const [url, setUrl] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80');
  const [tags, setTags] = useState('ui, dashboard, revenue');

  const brandMedia = mediaItems.filter(
    (m) => !activeBrand || m.brandId === activeBrand.id
  );

  const filteredMedia = brandMedia.filter(
    (m) => categoryFilter === 'all' || m.category === categoryFilter
  );

  const handleCopyUrl = (itemUrl: string, id: string) => {
    navigator.clipboard.writeText(itemUrl);
    setCopiedId(id);
    showToast('Asset URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please provide an asset title.', 'warning');
      return;
    }

    addMediaItem({
      brandId: activeBrand?.id || 'brand-1',
      name: name.trim(),
      category,
      url: url.trim(),
      sizeKb: 650,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Workspace: Media Library & Asset Storage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Brand Media Assets</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Organize brand logos, high-res UI product mockups, lifestyle photography, and ad creatives.
          </p>
        </div>

        {currentUserRole !== 'viewer' && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Upload New Asset</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'logo', 'product', 'lifestyle', 'creative', 'ad_asset'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              categoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredMedia.map((asset) => {
          const isCopied = copiedId === asset.id;

          return (
            <div
              key={asset.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              {/* Image Preview Container */}
              <div className="relative h-44 bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to neutral gradient if image load fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute top-2 left-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-indigo-300 border border-white/10">
                  {asset.category.replace('_', ' ')}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
                  {asset.sizeKb} KB
                </span>
              </div>

              {/* Info & Action Bar */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-white text-xs truncate" title={asset.name}>
                    {asset.name}
                  </div>
                  {currentUserRole !== 'viewer' && (
                    <button
                      onClick={() => deleteMediaItem(asset.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {asset.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">{asset.uploadedAt}</span>
                  <button
                    onClick={() => handleCopyUrl(asset.url, asset.id)}
                    className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Mock Asset Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Asset to Media Library</h3>
            <form onSubmit={handleCreateAsset} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. NexusFlow_Hero_Dashboard.png"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                >
                  <option value="logo">Logo</option>
                  <option value="product">Product / UI</option>
                  <option value="lifestyle">Lifestyle / Team</option>
                  <option value="creative">Creative Art</option>
                  <option value="ad_asset">Ad Creative</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. ui, dashboard, dark"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
