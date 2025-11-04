import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminLayout from "./AdminLayout";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  Save,
  X,
} from "lucide-react";

type Manekin = {
  id: string;
  nama_manekin: string;
  deskripsi: string | null;
  harga_sewa_per_3_jam: number | null;
  harga_sewa_per_hari: number | null;
  foto_url: string | null;
};

const currency = (n: number | null | undefined) =>
  "Rp " + (n ?? 0).toLocaleString("id-ID");

export default function ManekinManager() {
  const navigate = useNavigate();

  const [manekins, setManekins] = useState<Manekin[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Manekin>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Feedback kecil
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ---- Fetch ----
  const fetchManekins = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("manekin")
        .select(
          "id, nama_manekin, deskripsi, harga_sewa_per_3_jam, harga_sewa_per_hari, foto_url"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setManekins((data || []) as Manekin[]);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: `Gagal memuat data: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManekins();
  }, []);

  // ---- Storage ----
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("manekin-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("manekin-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // ---- Modal handlers ----
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      nama_manekin: "",
      deskripsi: "",
      harga_sewa_per_3_jam: 0,
      harga_sewa_per_hari: 0,
      foto_url: null,
    });
    setImageFile(null);
    setPreviewUrl(null);
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (m: Manekin) => {
    setIsEditing(true);
    setFormData({ ...m });
    setImageFile(null);
    setPreviewUrl(m.foto_url || null);
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
    setPreviewUrl(null);
    setStatusMsg(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : formData.foto_url || null);
  };

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // validasi ringan
      const h3 = Number(formData.harga_sewa_per_3_jam ?? 0);
      const hh = Number(formData.harga_sewa_per_hari ?? 0);
      if (h3 < 0 || hh < 0) {
        setStatusMsg({ type: "error", text: "Harga tidak boleh negatif." });
        return;
      }

      let fotoUrl = formData.foto_url || null;
      if (imageFile) {
        fotoUrl = await uploadImage(imageFile);
      }

      if (isEditing && formData.id) {
        const { error } = await supabase
          .from("manekin")
          .update({
            nama_manekin: formData.nama_manekin,
            deskripsi: formData.deskripsi ?? null,
            harga_sewa_per_3_jam: h3,
            harga_sewa_per_hari: hh,
            foto_url: fotoUrl,
          })
          .eq("id", formData.id);

        if (error) throw error;
        setStatusMsg({ type: "success", text: "Manekin berhasil diperbarui." });
      } else {
        const { error } = await supabase.from("manekin").insert([
          {
            nama_manekin: formData.nama_manekin,
            deskripsi: formData.deskripsi ?? null,
            harga_sewa_per_3_jam: h3,
            harga_sewa_per_hari: hh,
            foto_url: fotoUrl,
          },
        ]);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Manekin baru berhasil ditambahkan." });
      }

      await fetchManekins();
      setTimeout(() => closeModal(), 600);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: `Gagal menyimpan: ${err.message}` });
    }
  };

  // ---- Delete ----
  const handleDelete = async (id: string) => {
    if (!confirm("Hapus manekin ini?")) return;
    const { error } = await supabase.from("manekin").delete().eq("id", id);
    if (error) {
      setStatusMsg({ type: "error", text: `Gagal menghapus: ${error.message}` });
    } else {
      setStatusMsg({ type: "success", text: "Data manekin dihapus." });
      fetchManekins();
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50 transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] ml-2">
            Manekin Manager
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1D4ED8] transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Manekin</span>
        </button>
      </div>

      {/* Feedback */}
      {statusMsg && (
        <div
          className={`mb-4 rounded-xl border px-4 py-2 text-sm opacity-0 animate-[fadeIn_0.4s_ease-out_forwards] ${
            statusMsg.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Grid */}
      <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        {loading ? (
          <div className="text-gray-500">Memuat katalog…</div>
        ) : manekins.length === 0 ? (
          <div className="text-gray-500">Belum ada data manekin.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {manekins.map((m, idx) => (
              <div
                key={m.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${idx * 0.03}s`, opacity: 0 as any }}
              >
                <div className="p-4">
                  {m.foto_url ? (
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={m.foto_url}
                        alt={m.nama_manekin}
                        className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-gray-100 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                      <ImagePlus size={22} />
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="font-semibold text-lg text-[#111827] line-clamp-1">
                      {m.nama_manekin}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {m.deskripsi || "Belum ada deskripsi."}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                        <div className="text-xs text-gray-500">Per 3 jam</div>
                        <div className="font-semibold text-[#111827]">
                          {currency(m.harga_sewa_per_3_jam)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                        <div className="text-xs text-gray-500">Per hari</div>
                        <div className="font-semibold text-[#111827]">
                          {currency(m.harga_sewa_per_hari)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(m)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 border border-gray-200 rounded-2xl shadow-xl w-[600px] max-w-[94vw] animate-fadeIn">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold text-[#111827]">
                {isEditing ? "Edit Manekin" : "Tambah Manekin"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid gap-4">
                {/* Preview + nama */}
                <div className="flex gap-4">
                  <div className="w-44 h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 flex items-center gap-2">
                        <ImagePlus size={18} />
                        <span className="text-sm">Preview</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 grid gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Manekin
                      </label>
                      <input
                        type="text"
                        value={formData.nama_manekin || ""}
                        onChange={(e) =>
                          setFormData((s) => ({ ...s, nama_manekin: e.target.value }))
                        }
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga Per 3 Jam
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={formData.harga_sewa_per_3_jam ?? ""}
                          onChange={(e) =>
                            setFormData((s) => ({
                              ...s,
                              harga_sewa_per_3_jam: Number(e.target.value),
                            }))
                          }
                          required
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga Per Hari
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={formData.harga_sewa_per_hari ?? ""}
                          onChange={(e) =>
                            setFormData((s) => ({
                              ...s,
                              harga_sewa_per_hari: Number(e.target.value),
                            }))
                          }
                          required
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    rows={4}
                    value={formData.deskripsi ?? ""}
                    onChange={(e) =>
                      setFormData((s) => ({ ...s, deskripsi: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Tuliskan detail alat, materi praktik yang cocok, dsb."
                  />
                </div>

                {/* File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Manekin
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                >
                  <Save size={16} />
                  <span>{isEditing ? "Simpan Perubahan" : "Simpan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
