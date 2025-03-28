import { createClient } from '@supabase/supabase-js';

class SupabaseService {
  static instance = null;
  supabase = null;

  constructor() {
    if (!SupabaseService.instance) {
      const supabaseUrl = 'https://jemnlthnuwwxtumrdili.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbW5sdGhudXd3eHR1bXJkaWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzkzMTUsImV4cCI6MjA1NDk1NTMxNX0.LXIxRSc59MnKtZ-II9XLbW0DshX1EXBN9Ex9Fc1xT8E';
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
      SupabaseService.instance = this;
    }
    return SupabaseService.instance;
  }

  getClient() {
    return this.supabase;
  }
}

const supabaseService = new SupabaseService();
export default supabaseService;
