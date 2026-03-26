'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  agentName: string;
  timestamp: string;
}

// Mock alerts - replace with real data from Supabase
const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'error',
    message: 'Error rate exceeded 5%',
    agentName: 'Support Bot A',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    type: 'warning',
    message: 'Autonomy level below 50%',
    agentName: 'Ops Monitor B',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    type: 'info',
    message: 'Throughput increased by 20%',
    agentName: 'Creative Gen C',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

const ALERT_ICONS = {
  error: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const ALERT_COLORS = {
  error: 'text-red-500 bg-red-500/10 border-red-500/20',
  warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  info: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
};

export function AlertsPanel() {
  const [alerts, setAlerts] = React.useState(MOCK_ALERTS);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

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
          <AlertTriangle className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-white">Alerts</h3>
          {alerts.length > 0 && (
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Info className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
            <p className="text-sm text-zinc-500">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = ALERT_ICONS[alert.type];
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${ALERT_COLORS[alert.type]} flex items-start gap-3`}
              >
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {alert.agentName} • {formatTime(alert.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 hover:bg-white/10 rounded flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
