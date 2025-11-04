import { supabase } from "./supabaseClient";

/** Simpan token aktif ke tabel users */
export async function updateCurrentToken(userId: string, token: string) {
  await supabase.from("users").update({ current_token: token }).eq("id", userId);
}

/** Hapus token saat logout */
export async function clearCurrentToken(userId: string) {
  await supabase.from("users").update({ current_token: null }).eq("id", userId);
}

/** Validasi token agar hanya satu device aktif */
export async function validateToken() {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) return;

  const { data: userData } = await supabase
    .from("users")
    .select("current_token")
    .eq("id", session.user.id)
    .single();

  if (userData && userData.current_token !== session.access_token) {
    await supabase.auth.signOut();
    alert("⚠️ Akun ini sudah login di perangkat lain.");
    window.location.href = "/";
  }
}
