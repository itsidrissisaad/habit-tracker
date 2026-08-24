import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('YOUR_PROJECT_REF') &&
    !supabaseKey.includes('xxxxxxxx')
);

if (!isSupabaseConfigured) {
    console.warn(
        '[Habit Tracker] Supabase credentials not found or using placeholders in .env.local. Operating in local/guest mode.'
    );
}

// Initialize client with configured credentials or safe placeholder to avoid breaking module imports
export const supabase: SupabaseClient = createClient(
    isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
    isSupabaseConfigured ? supabaseKey : 'placeholder-anon-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
        }
    }
);

