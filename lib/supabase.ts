// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kocubqbvolokinbefgoz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvY3VicWJ2b2xva2luYmVmZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNDg4MDgsImV4cCI6MjA1OTkyNDgwOH0.awoIsVlhGuTZwkj_EFij9I1S2Wpl_L9KF34lHDvrDhM'
import AsyncStorage from '@react-native-async-storage/async-storage';



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage, // This ensures session persistence in AsyncStorage
      autoRefreshToken: true,
      persistSession: true,  // Ensures the session persists across app restarts
      detectSessionInUrl: false,
    },
  });