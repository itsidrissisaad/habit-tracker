import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// The rest of your supabase initialization code remains the same!
const supabaseUrl = 'https://uwdpmkquorftfydmgzov.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZHBta3F1b3JmdGZ5ZG1nem92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0OTI4MDMsImV4cCI6MjEwMzA2ODgwM30.O22v_PlgWKOURp8TRH8vjGuDKrPg1QMYc-cghxHxDns'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)