'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AgentPieChart,
  AgentSidebar,
  MetricsPanel,
  CalendarWidget,
  TodoWidget,
  QuickLinks,
  AlertsPanel,
  EscalationQueue,
} from '@stragra/dashboard-ui';
import { Mail } from 'lucide-react';

const queryClient = new QueryClient();

function DashboardContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Left Panel - Agent Pie Chart + Sidebar */}
      <div className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-white">Stragra</h1>
          <p className="text-sm text-zinc-500">AI Agency Dashboard</p>
        </div>

        <div className="p-4">
          <h2 className="text-sm font-medium text-zinc-400 mb-4">Agent Distribution</h2>
          <AgentPieChart
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="flex-1 border-t border-zinc-800">
          <AgentSidebar
            selectedCategory={selectedCategory}
            onSelectAgent={setSelectedAgentId}
            selectedAgentId={selectedAgentId}
          />
        </div>
      </div>

      {/* Center Panel - Metrics */}
      <div className="flex-1 bg-zinc-900">
        <MetricsPanel agentId={selectedAgentId} />
      </div>

      {/* Right Panel - Widgets */}
      <div className="w-80 bg-zinc-950 border-l border-zinc-800 p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Email Link */}
          <a
            href="mailto:"
            className="flex items-center gap-2 p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <Mail className="w-5 h-5 text-zinc-400" />
            <span className="text-sm text-zinc-300">Open Email Client</span>
          </a>

          <CalendarWidget />
          <TodoWidget />
          <QuickLinks />
          <AlertsPanel />
          <EscalationQueue />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR/hydration mismatch - only render after mount
  if (!mounted) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
