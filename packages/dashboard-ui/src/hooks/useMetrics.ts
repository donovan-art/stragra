import { useQuery } from '@tanstack/react-query';
import { supabase } from '@stragra/supabase';

const METRICS_KEY = 'agent-metrics';

export function useMetrics(agentId: string | null) {
  return useQuery({
    queryKey: [METRICS_KEY, agentId],
    queryFn: async () => {
      if (!agentId) return [];
      
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!agentId,
  });
}

export function useMetricsSummary(agentId: string | null) {
  return useQuery({
    queryKey: [METRICS_KEY, 'summary', agentId],
    queryFn: async () => {
      if (!agentId) return null;
      
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Calculate summary stats
      const metrics = data || [];
      const byType = metrics.reduce((acc, m) => {
        acc[m.metric_type] = acc[m.metric_type] || [];
        acc[m.metric_type].push(m.value);
        return acc;
      }, {} as Record<string, number[]>);

      return Object.entries(byType).map(([type, values]) => ({
        metric_type: type,
        latest: values[0],
        average: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length,
      }));
    },
    enabled: !!agentId,
  });
}
