'use client';

import { FileExplorer } from '@stragra/file-explorer';

export default function FilesPage() {
  return (
    <div className="h-screen p-4 bg-zinc-950">
      <div className="h-full max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">File Explorer</h1>
        <div className="h-[calc(100%-3rem)]">
          <FileExplorer />
        </div>
      </div>
    </div>
  );
}
