import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a mock client for build time when env vars aren't available
const mockClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ count: 'exact', head: true, eq: () => ({ data: null, error: null }), data: null, error: null }),
  }),
} as unknown as SupabaseClient;

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : mockClient;
