import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@stragra/supabase';
import { getCurrentUser } from '@stragra/supabase';

const AGENTS_KEY = 'agents';

export function useAgents() {
  return useQuery({
    queryKey: [AGENTS_KEY],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's agency first
      const { data: agency } = await supabase
        .from('agencies')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!agency) return [];

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('agency_id', agency.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useAgent(agentId: string | null) {
  return useQuery({
    queryKey: [AGENTS_KEY, agentId],
    queryFn: async () => {
      if (!agentId) return null;
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!agentId,
  });
}
