import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminLayout from "./AdminLayout"; // pakai layout admin yang sudah kamu punya
import { Users, Wrench, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotals = async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data, error } = await supabase.rpc("total_registered_users");
        if (error) throw error;
        setTotalUsers(data ?? 0);
      } catch (e: any) {
        setErr(e.message || "Gagal memuat statistik");
        setTotalUsers(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTotals();
  }, []);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between opacity-0 animate-[fadeIn_0.35s_ease-out_forwards]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">Ringkasan cepat sistem MedSkill</p>
        </div>
      </div>

      {/* Error state */}
      {err && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {err}
        </div>
      )}

      {/* Top stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total User Terdaftar */}
        <div className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total User Terdaftar</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#111827]">
                  {loading ? "…" : (totalUsers ?? 0)}
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-[#E7F0FF] text-[#1E3A8A] p-3">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Aksi utama: Kelola Manekin */}
        <button
          onClick={() => navigate("/admin/manekin")}
          className="text-left group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 opacity-0 animate-[fadeIn_0.45s_ease-out_forwards]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aksi</p>
              <h3 className="mt-1 text-xl font-semibold text-[#111827] flex items-center gap-2">
                Kelola Manekin
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Tambah, edit, dan hapus item katalog manekin.
              </p>
            </div>
            <div className="rounded-xl bg-gray-100 text-gray-700 p-3">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </button>

        {/* Placeholder kartu (bisa dipakai nanti untuk metrik lain) */}
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <p className="text-sm text-gray-400">Slot metric lain (opsional)</p>
          <p className="text-[13px] text-gray-400 mt-1">
            Misalnya: total halaman, total kursus, dsb.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
