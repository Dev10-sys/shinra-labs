import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')

// Database table names
export const TABLES = {
  USERS: 'users',
  TASKS: 'tasks',
  DATASETS: 'datasets',
  SUBMISSIONS: 'submissions',
  PURCHASES: 'purchases',
  TRANSACTIONS: 'transactions',
  LEADERBOARD: 'leaderboard',
}

