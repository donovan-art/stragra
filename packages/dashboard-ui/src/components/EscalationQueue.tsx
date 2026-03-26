'use client';

import React from 'react';
import { UserCheck, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Escalation {
  id: string;
  taskId: string;
  agentName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
}

// Mock escalations - replace with real data from Supabase
const MOCK_ESCALATIONS: Escalation[] = [
  {
    id: '1',
    taskId: 'task-123',
    agentName: 'Support Bot A',
    reason: 'Complex issue requiring human judgment',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '2',
    taskId: 'task-124',
    agentName: 'Finance Agent X',
    reason: 'Unusual transaction pattern detected',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

const STATUS_ICONS = {
  pending: AlertCircle,
  resolved: CheckCircle2,
  rejected: AlertCircle,
};

const STATUS_COLORS = {
  pending: 'text-amber-500',
  resolved: 'text-green-500',
  rejected: 'text-red-500',
};

export function EscalationQueue() {
  const [escalations, setEscalations] = React.useState(MOCK_ESCALATIONS);

  const handleResolve = (id: string) => {
    setEscalations(escalations.map(e => 
      e.id === id ? { ...e, status: 'resolved' as const } : e
    ));
  };

  const handleReject = (id: string) => {
    setEscalations(escalations.map(e => 
      e.id === id ? { ...e, status: 'rejected' as const } : e
    ));
  };

  const pendingCount = escalations.filter(e => e.status === 'pending').length;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-white">Human Review Queue</h3>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
              {pendingCount}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {escalations.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
            <p className="text-sm text-zinc-500">No pending escalations</p>
          </div>
        ) : (
          escalations.map((escalation) => {
            const Icon = STATUS_ICONS[escalation.status];
            return (
              <div
                key={escalation.id}
                className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${STATUS_COLORS[escalation.status]}`} />
                    <span className="text-sm font-medium text-white">
                      {escalation.agentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {formatTime(escalation.createdAt)}
                  </div>
                </div>

                <p className="text-sm text-zinc-400 mt-2">{escalation.reason}</p>

                {escalation.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleResolve(escalation.id)}
                      className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded hover:bg-green-600/30"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleReject(escalation.id)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
