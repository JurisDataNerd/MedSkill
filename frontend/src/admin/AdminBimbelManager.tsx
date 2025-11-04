import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

interface BimbelClass {
  id: string;
  title: string;
  description: string;
  img_url: string;
  mentor_name: string;
  price: number;
  category: string;
  gform_link: string;
  is_published: boolean;
  is_hot: boolean;
  created_at?: string;
}

export default function AdminBimbelManager() {
  const [classes, setClasses] = useState<BimbelClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<BimbelClass>>({
    category: "KOS", // ✅ default isi kategori
    price: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 🔹 Ambil Data dari Supabase
  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bimbel_classes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Gagal memuat data:", error.message);
      setClasses([]);
    } else {
      setClasses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // 🔹 Upload gambar ke storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const filePath = `bimbel_images/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("medskill_assets")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("medskill_assets")
        .getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, img_url: data.publicUrl }));
      alert("✅ Gambar berhasil diupload!");
    } catch (err: any) {
      alert("❌ Upload gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Submit form (insert / update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = form.title?.trim() ?? "";
    const category = form.category?.trim().toUpperCase() ?? "";

    if (!title || !category) {
      alert("Judul dan kategori wajib diisi!");
      return;
    }

    const payload = {
      ...form,
      title,
      category,
      price: form.price ?? 0,
      description: form.description?.trim() || "-",
      mentor_name: form.mentor_name?.trim() || "-",
      gform_link: form.gform_link?.trim() || "",
      is_published: form.is_published ?? false,
      is_hot: form.is_hot ?? false,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("bimbel_classes")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("bimbel_classes").insert([payload]);
        if (error) throw error;
      }

      setForm({ category: "KOS", price: 0 });
      setEditingId(null);
      fetchClasses();
    } catch (err: any) {
      alert("Gagal menyimpan data: " + err.message);
    }
  };

  // 🔹 Delete class
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus kelas ini?")) return;
    const { error } = await supabase.from("bimbel_classes").delete().eq("id", id);
    if (error) alert("Gagal menghapus data: " + error.message);
    fetchClasses();
  };

  // 🔹 Toggle publish / hot
  const toggleField = async (id: string, field: "is_published" | "is_hot", value: boolean) => {
    const { error } = await supabase
      .from("bimbel_classes")
      .update({ [field]: !value })
      .eq("id", id);
    if (error) alert("Gagal update status: " + error.message);
    fetchClasses();
  };

  // 🔹 Input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A8A]">Kelola Bimbel UKMPPD</h1>
      </div>

      {/* FORM TAMBAH / EDIT */}
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white border p-5 rounded-2xl shadow-sm mb-8">
        <input type="text" name="title" placeholder="Judul Kelas" value={form.title || ""} onChange={handleChange} className="border rounded-lg px-3 py-2" />
        <input type="text" name="mentor_name" placeholder="Nama Mentor" value={form.mentor_name || ""} onChange={handleChange} className="border rounded-lg px-3 py-2" />
        <input type="number" name="price" placeholder="Harga (boleh kosong = gratis)" value={form.price || ""} onChange={handleChange} className="border rounded-lg px-3 py-2" />
        <select name="category" value={form.category || "KOS"} onChange={handleChange} className="border rounded-lg px-3 py-2">
          <option value="KOS">KOS / SOS</option>
          <option value="MATERI">Full Course</option>
          <option value="OSCE">OSCE</option>
          <option value="TRYOUT">Tryout</option>
        </select>

        {/* Upload Gambar */}
        <div className="col-span-2 flex flex-col gap-2">
          <label className="font-medium text-sm text-gray-700">Upload Gambar</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="border rounded-lg px-3 py-2" />
          {uploading && <p className="text-blue-600 text-sm">Mengupload...</p>}
          {form.img_url && <img src={form.img_url} alt="Preview" className="w-40 h-28 object-cover rounded-lg border" />}
        </div>

        <textarea name="description" placeholder="Deskripsi" value={form.description || ""} onChange={handleChange} className="border rounded-lg px-3 py-2 col-span-2" />
        <input type="text" name="gform_link" placeholder="Link Google Form (opsional)" value={form.gform_link || ""} onChange={handleChange} className="border rounded-lg px-3 py-2 col-span-2" />

        <button type="submit" disabled={uploading} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg px-4 py-2 mt-1 font-medium">
          {editingId ? "Update Kelas" : "Tambah Kelas"}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ category: "KOS", price: 0 }); }} className="border rounded-lg px-4 py-2 mt-1 font-medium">
            Batal Edit
          </button>
        )}
      </form>

      {/* DAFTAR KELAS */}
      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-2xl shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Judul</th>
                <th className="p-3 text-left">Mentor</th>
                <th className="p-3 text-left">Kategori</th>
                <th className="p-3 text-center">Hot</th>
                <th className="p-3 text-center">Publish</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{cls.title}</td>
                  <td className="p-3">{cls.mentor_name}</td>
                  <td className="p-3 capitalize">{cls.category}</td>
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={cls.is_hot} onChange={() => toggleField(cls.id, "is_hot", cls.is_hot)} />
                  </td>
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={cls.is_published} onChange={() => toggleField(cls.id, "is_published", cls.is_published)} />
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => { setEditingId(cls.id); setForm(cls); }} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(cls.id)} className="text-red-600 hover:underline">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
