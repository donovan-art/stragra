'use client';

import React, { useState } from 'react';
import { Link2, Plus, ExternalLink, GripVertical, Trash2 } from 'lucide-react';
import { useQuickLinks, useCreateQuickLink, useDeleteQuickLink } from '../hooks/useTodos';

const ICONS: Record<string, React.ReactNode> = {
  default: <Link2 className="w-4 h-4" />,
};

export function QuickLinks() {
  const { data: links, isLoading } = useQuickLinks();
  const createLink = useCreateQuickLink();
  const deleteLink = useDeleteQuickLink();
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '', icon: 'default' });

  const handleAdd = () => {
    if (newLink.name.trim() && newLink.url.trim()) {
      let url = newLink.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      createLink.mutate({ ...newLink, url, position: links?.length || 0 });
      setNewLink({ name: '', url: '', icon: 'default' });
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 h-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-white">Quick Links</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newLink.name}
            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
            placeholder="Link name..."
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white placeholder-zinc-500"
          />
          <input
            type="text"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder="URL..."
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white placeholder-zinc-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Add Link
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {links?.length === 0 && !isAdding && (
          <p className="text-sm text-zinc-500 text-center py-4">No links yet</p>
        )}

        {links?.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-2 group p-2 hover:bg-zinc-800 rounded"
          >
            <GripVertical className="w-3 h-3 text-zinc-600 cursor-grab" />
            <span className="text-zinc-400">{ICONS[link.icon || 'default'] || ICONS.default}</span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-sm text-zinc-300 hover:text-white truncate"
            >
              {link.name}
            </a>
            <ExternalLink className="w-3 h-3 text-zinc-600" />
            <button
              onClick={() => deleteLink.mutate(link.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
