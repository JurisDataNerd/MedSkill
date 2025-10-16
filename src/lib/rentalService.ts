import { supabase } from "./supabaseClient";

// Ambil semua manekin (tersedia untuk katalog)
export async function getAllManekin() {
  const { data, error } = await supabase
    .from("manekin")
    .select(`
      id,
      nama_manekin,
      deskripsi,
      harga_sewa_per_hari,
      harga_sewa_per_3_jam,
      foto_url
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Gagal mengambil data manekin:", error.message);
    return [];
  }

  return data;
}

// Ambil data manekin by ID (untuk halaman detail jika diperlukan)
export async function getManekinById(id: string) {
  const { data, error } = await supabase
    .from("manekin")
    .select(`
      id,
      nama_manekin,
      deskripsi,
      harga_sewa_per_hari,
      harga_sewa_per_3_jam,
      foto_url
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Gagal mengambil detail manekin:", error.message);
    return null;
  }

  return data;
}
