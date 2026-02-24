import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oopqocihxbozievqrpcv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '' // User needs to provide this or I use a placeholder for now

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
