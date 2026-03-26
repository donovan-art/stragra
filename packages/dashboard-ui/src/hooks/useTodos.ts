import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, getCurrentUser } from '@stragra/supabase';

const TODOS_KEY = 'todos';
const QUICK_LINKS_KEY = 'quick-links';

export interface Todo {
  id: string;
  agency_id: string;
  text: string;
  priority: string | null;
  is_done: boolean | null;
  created_at: string | null;
}

export interface QuickLink {
  id: string;
  agency_id: string;
  name: string;
  url: string;
  icon: string | null;
  position: number | null;
}

async function getAgencyId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data } = await (supabase as any)
    .from('agencies')
    .select('id')
    .eq('owner_id', user.id)
    .single();
    
  return data?.id || null;
}

export function useTodos() {
  return useQuery<Todo[]>({
    queryKey: [TODOS_KEY],
    queryFn: async () => {
      const agencyId = await getAgencyId();
      if (!agencyId) return [];

      const { data, error } = await (supabase as any)
        .from('todos')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Todo[];
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ text, priority }: { text: string; priority: string }) => {
      const agencyId = await getAgencyId();
      if (!agencyId) throw new Error('No agency found');

      const { data, error } = await (supabase as any)
        .from('todos')
        .insert({ text, priority, agency_id: agencyId })
        .select()
        .single();

      if (error) throw error;
      return data as Todo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Todo>) => {
      const { data, error } = await (supabase as any)
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Todo;
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
      const { error } = await (supabase as any).from('todos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });
}

export function useQuickLinks() {
  return useQuery<QuickLink[]>({
    queryKey: [QUICK_LINKS_KEY],
    queryFn: async () => {
      const agencyId = await getAgencyId();
      if (!agencyId) return [];

      const { data, error } = await (supabase as any)
        .from('quick_links')
        .select('*')
        .eq('agency_id', agencyId)
        .order('position', { ascending: true });

      if (error) throw error;
      return (data || []) as QuickLink[];
    },
  });
}

export function useCreateQuickLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, url, icon, position }: { name: string; url: string; icon: string; position: number }) => {
      const agencyId = await getAgencyId();
      if (!agencyId) throw new Error('No agency found');

      const { data, error } = await (supabase as any)
        .from('quick_links')
        .insert({ name, url, icon, position, agency_id: agencyId })
        .select()
        .single();

      if (error) throw error;
      return data as QuickLink;
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
      const { error } = await (supabase as any).from('quick_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUICK_LINKS_KEY] });
    },
  });
}
