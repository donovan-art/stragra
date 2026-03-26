import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, getCurrentUser } from '@stragra/supabase';

const TODOS_KEY = 'todos';
const QUICK_LINKS_KEY = 'quick-links';

async function getAgencyId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data } = await supabase
    .from('agencies')
    .select('id')
    .eq('owner_id', user.id)
    .single();
    
  return data?.id || null;
}

// Todos
export function useTodos() {
  return useQuery({
    queryKey: [TODOS_KEY],
    queryFn: async () => {
      const agencyId = await getAgencyId();
      if (!agencyId) return [];

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ text, priority }: { text: string; priority: string }) => {
      const agencyId = await getAgencyId();
      if (!agencyId) throw new Error('No agency found');

      const { data, error } = await supabase
        .from('todos')
        .insert({ text, priority, agency_id: agencyId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });
}

// Quick Links
export function useQuickLinks() {
  return useQuery({
    queryKey: [QUICK_LINKS_KEY],
    queryFn: async () => {
      const agencyId = await getAgencyId();
      if (!agencyId) return [];

      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .eq('agency_id', agencyId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateQuickLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, url, icon, position }: { name: string; url: string; icon: string; position: number }) => {
      const agencyId = await getAgencyId();
      if (!agencyId) throw new Error('No agency found');

      const { data, error } = await supabase
        .from('quick_links')
        .insert({ name, url, icon, position, agency_id: agencyId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUICK_LINKS_KEY] });
    },
  });
}

export function useDeleteQuickLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quick_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUICK_LINKS_KEY] });
    },
  });
}
