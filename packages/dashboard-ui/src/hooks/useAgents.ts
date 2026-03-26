import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, getCurrentUser } from '@stragra/supabase';

const AGENTS_KEY = 'agents';

export interface Agent {
  id: string;
  agency_id: string;
  name: string;
  division: string;
  agent_type: string | null;
  autonomy_level: number | null;
  is_active: boolean | null;
  config: Record<string, any> | null;
  created_at: string | null;
}

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: [AGENTS_KEY],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const { data: agency } = await (supabase as any)
        .from('agencies')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!agency) return [];

      const { data, error } = await (supabase as any)
        .from('agents')
        .select('*')
        .eq('agency_id', agency.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Agent[];
    },
  });
}

export function useAgent(agentId: string | null) {
  return useQuery<Agent | null>({
    queryKey: [AGENTS_KEY, agentId],
    queryFn: async () => {
      if (!agentId) return null;
      const { data, error } = await (supabase as any)
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) throw error;
      return data as Agent;
    },
    enabled: !!agentId,
  });
}
