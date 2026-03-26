'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FileExplorer } from '@stragra/file-explorer-new';

const queryClient = new QueryClient();

export default function FilesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR/hydration mismatch
  if (!mounted) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen p-4 bg-zinc-950">
        <div className="h-full max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">File Explorer</h1>
          <div className="h-[calc(100%-3rem)]">
            <FileExplorer />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
