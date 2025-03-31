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
  async signInWithGoogle(){
    return await this.supabase.auth.signInWithOAuth({
      provider:'google',
    });
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

  async getUserClubPosition(email) {
    const { data, error } = await this.supabase
      .from("clubMembers")
      .select("position")
      .eq("email", email)
    return error ? null : data.map(item => item.position);
  }

  async getUniqueUserClubPosition(email,clubId) {
    const { data, error } = await this.supabase
      .from("clubMembers")
      .select("position")
      .eq("email", email)
      .eq("club_id",clubId)
    return error ? null : data[0].position;
  }
  

  async getEmail(userId) {
    const { data, error } = await this.supabase
      .from("user")
      .select("email")
      .eq("id", userId)
      .single();
    return error ? null : data.email;
  }
}

const authService = new AuthService();
export default authService;
