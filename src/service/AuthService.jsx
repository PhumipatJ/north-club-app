import supabase from "../../supabaseClient";

class AuthService {
  static instance = null;

  constructor() {
    if (!AuthService.instance) {
      this.supabase = supabase;
      AuthService.instance = this;
    }
    return AuthService.instance;
  }

  async login(email, password) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async register(email, password) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async logout() {
    await this.supabase.auth.signOut();
    window.location.reload();
  }

  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data?.session || null;
  }

  async getUserRole(userId) {
    const { data, error } = await this.supabase
      .from("user")
      .select("role")
      .eq("id", userId)
      .single();
    return error ? null : data.role;
  }
}

const authService = new AuthService();
export default authService;
