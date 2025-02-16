import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jemnlthnuwwxtumrdili.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbW5sdGhudXd3eHR1bXJkaWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzkzMTUsImV4cCI6MjA1NDk1NTMxNX0.LXIxRSc59MnKtZ-II9XLbW0DshX1EXBN9Ex9Fc1xT8E';

export const supabase = createClient(supabaseUrl,supabaseAnonKey);