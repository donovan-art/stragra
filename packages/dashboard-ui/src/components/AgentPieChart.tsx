'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useAgents } from '../hooks/useAgents';

ChartJS.register(ArcElement, Tooltip, Legend);

// Agent category colors
const CATEGORY_COLORS: Record<string, string> = {
  support: '#f59e0b',    // amber
  operations: '#22c55e', // green
  creative: '#3b82f6',   // blue
  finance: '#a855f7',    // purple
};

interface AgentPieChartProps {
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string | null;
}

export function AgentPieChart({ onSelectCategory, selectedCategory }: AgentPieChartProps) {
  const { data: agents, isLoading } = useAgents();

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Group agents by division
  const divisionCounts = agents?.reduce((acc, agent) => {
    const division = agent.division.toLowerCase();
    acc[division] = (acc[division] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const labels = Object.keys(divisionCounts).map(d => d.charAt(0).toUpperCase() + d.slice(1));
  const data = Object.values(divisionCounts);
  const colors = Object.keys(divisionCounts).map(d => CATEGORY_COLORS[d] || '#6b7280');

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: '#000000',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    onClick: (_event, elements) => {
      if (elements.length > 0 && onSelectCategory) {
        const index = elements[0].index;
        const category = Object.keys(divisionCounts)[index];
        onSelectCategory(category);
      }
    },
  };

  return (
    <div className="h-64 relative">
      <Pie data={chartData} options={options} />
    </div>
  );
}
