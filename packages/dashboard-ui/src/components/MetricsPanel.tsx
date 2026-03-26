'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useMetrics } from '../hooks/useMetrics';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MetricsPanelProps {
  agentId: string | null;
}

const METRIC_CATEGORIES = {
  performance: ['tasks_completed', 'avg_response_time_ms', 'throughput_per_hour', 'uptime_percent'],
  quality: ['accuracy_rate', 'retry_rate', 'escalation_rate', 'avg_confidence'],
  efficiency: ['tokens_used', 'cost_per_task', 'hours_saved'],
  roi: ['total_cost_savings', 'roi_percent'],
  health: ['error_rate', 'consecutive_failures'],
};

export function MetricsPanel({ agentId }: MetricsPanelProps) {
  const { data: metrics, isLoading } = useMetrics(agentId);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!agentId) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        <p>Select an agent to view metrics</p>
      </div>
    );
  }

  // Group metrics by category
  const groupedMetrics = metrics?.reduce((acc, m) => {
    for (const [category, types] of Object.entries(METRIC_CATEGORIES)) {
      if (types.includes(m.metric_type)) {
        acc[category] = acc[category] || [];
        acc[category].push(m);
      }
    }
    return acc;
  }, {} as Record<string, typeof metrics>);

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Agent Metrics</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(METRIC_CATEGORIES).map(([category, types]) => (
          <MetricCard
            key={category}
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            metrics={groupedMetrics?.[category] || []}
          />
        ))}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  metrics: Array<{
    metric_type: string;
    value: number;
    recorded_at: string;
  }>;
}

function MetricCard({ title, metrics }: MetricCardProps) {
  if (metrics.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">{title}</h3>
        <p className="text-zinc-600 text-sm">No data available</p>
      </div>
    );
  }

  // Create sparkline data
  const labels = metrics.map(m => new Date(m.recorded_at).toLocaleDateString());
  const data = metrics.map(m => m.value);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  // Calculate trend
  const firstValue = data[0] || 0;
  const lastValue = data[data.length - 1] || 0;
  const trend = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'flat';

  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{title}</h3>
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
        {trend === 'flat' && <Minus className="w-4 h-4 text-zinc-500" />}
      </div>

      <div className="space-y-3">
        {metrics.slice(0, 4).map((metric) => (
          <div key={metric.metric_type} className="flex items-center justify-between">
            <span className="text-sm text-zinc-300 capitalize">
              {metric.metric_type.replace(/_/g, ' ')}
            </span>
            <span className="text-sm font-mono text-white">
              {formatMetricValue(metric.metric_type, metric.value)}
            </span>
          </div>
        ))}
      </div>

      {data.length > 1 && (
        <div className="h-16 mt-4">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

function formatMetricValue(type: string, value: number): string {
  if (type.includes('percent') || type.includes('rate')) {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (type.includes('time') || type.includes('ms')) {
    return `${value.toFixed(0)}ms`;
  }
  if (type.includes('cost') || type.includes('savings')) {
    return `$${value.toFixed(2)}`;
  }
  if (type.includes('hours')) {
    return `${value.toFixed(1)}h`;
  }
  return value.toLocaleString();
}
