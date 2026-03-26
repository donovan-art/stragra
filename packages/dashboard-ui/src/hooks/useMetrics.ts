import { useQuery } from '@tanstack/react-query';
import { supabase } from '@stragra/supabase';

const METRICS_KEY = 'agent-metrics';

export interface AgentMetric {
  id: string;
  agent_id: string;
  metric_type: string;
  value: number;
  recorded_at: string | null;
}

export function useMetrics(agentId: string | null) {
  return useQuery<AgentMetric[]>({
    queryKey: [METRICS_KEY, agentId],
    queryFn: async () => {
      if (!agentId) return [];
      
      const { data, error } = await (supabase as any)
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return (data || []) as AgentMetric[];
    },
    enabled: !!agentId,
  });
}
