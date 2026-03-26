'use client';

import React from 'react';
import { useAgents } from '../hooks/useAgents';
import { Bot, Circle, AlertCircle, Power } from 'lucide-react';

// Agent category colors
const CATEGORY_COLORS: Record<string, string> = {
  support: '#f59e0b',    // amber
  operations: '#22c55e', // green
  creative: '#3b82f6',   // blue
  finance: '#a855f7',    // purple
};

interface AgentSidebarProps {
  selectedCategory: string | null;
  onSelectAgent: (agentId: string) => void;
  selectedAgentId: string | null;
}

export function AgentSidebar({ selectedCategory, onSelectAgent, selectedAgentId }: AgentSidebarProps) {
  const { data: agents, isLoading } = useAgents();

  const filteredAgents = selectedCategory
    ? agents?.filter(a => a.division.toLowerCase() === selectedCategory.toLowerCase())
    : agents;

  if (isLoading) {
    return (
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-full flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Agents
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          {filteredAgents?.length || 0} active
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredAgents?.map((agent) => {
          const color = CATEGORY_COLORS[agent.division.toLowerCase()] || '#6b7280';
          const isSelected = selectedAgentId === agent.id;

          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-zinc-800 transition-colors text-left border-l-2 ${
                isSelected ? 'bg-zinc-800 border-l-blue-500' : 'border-l-transparent'
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Bot className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                <p className="text-xs text-zinc-400 capitalize">{agent.division}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {agent.is_active ? (
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                ) : (
                  <Power className="w-2 h-2 text-zinc-500" />
                )}
                {agent.autonomy_level && agent.autonomy_level < 0.5 && (
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
