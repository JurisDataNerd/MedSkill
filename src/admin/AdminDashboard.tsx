import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminLayout from "./AdminLayout";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import { ArrowRight, TrendingUp, Wallet, ClipboardList } from "lucide-react";

type Row = {
  id: string;
  tanggal_sewa: string; // YYYY-MM-DD
  durasi_sewa: number;
  status_pembayaran: "pending" | "terverifikasi" | "batal";
  manekin: { harga_sewa: number } | null;
};

const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#9CA3AF"]; // biru, hijau, amber, gray

function StatCard({
  title,
  value,
  subtitle,
  icon
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: "0.05s" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500">{title}</p>
        <div className="text-gray-400 group-hover:text-[#1E3A8A] transition-colors">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-[#111827]">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("manekin_bookings")
        .select(`
          id, tanggal_sewa, durasi_sewa, status_pembayaran,
          manekin:manekin (harga_sewa)
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const norm: Row[] = data.map((d: any) => ({
          id: d.id,
          tanggal_sewa: d.tanggal_sewa,
          durasi_sewa: d.durasi_sewa,
          status_pembayaran: d.status_pembayaran,
          manekin: Array.isArray(d.manekin) ? d.manekin[0] : d.manekin,
        }));
        setRows(norm);
      }
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const sukses = rows.filter((r) => r.status_pembayaran === "terverifikasi").length;
    const pendapatan = rows.reduce((acc, r) => {
      if (r.status_pembayaran === "terverifikasi" && r.manekin?.harga_sewa) {
        acc += r.manekin.harga_sewa * r.durasi_sewa;
      }
      return acc;
    }, 0);
    const rataTicket =
      sukses > 0 ? Math.round(pendapatan / sukses).toLocaleString("id-ID") : "0";
    return {
      total,
      sukses,
      pendapatan: "Rp " + pendapatan.toLocaleString("id-ID"),
      rataTicket,
    };
  }, [rows]);

  // Bar/Area data: group by tanggal_sewa (10 terbaru)
  const timelineData = useMemo(() => {
    const map: Record<string, { date: string; orders: number; earning: number }> = {};
    rows.forEach((r) => {
      const key = r.tanggal_sewa;
      if (!map[key]) map[key] = { date: key, orders: 0, earning: 0 };
      map[key].orders += 1;
      if (r.status_pembayaran === "terverifikasi" && r.manekin?.harga_sewa) {
        map[key].earning += r.manekin.harga_sewa * r.durasi_sewa;
      }
    });
    return Object.values(map)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10);
  }, [rows]);

  // Donut “Yearly Breakup” (status distribution)
  const donutData = useMemo(() => {
    const p = rows.filter((r) => r.status_pembayaran === "pending").length;
    const v = rows.filter((r) => r.status_pembayaran === "terverifikasi").length;
    const b = rows.filter((r) => r.status_pembayaran === "batal").length;
    return [
      { name: "Terverifikasi", value: v },
      { name: "Pending", value: p },
      { name: "Batal", value: b },
    ];
  }, [rows]);

  return (
    <AdminLayout>
      {/* Heading + CTA */}
      <div className="mb-6 flex items-center justify-between opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Ringkasan performa rental manekin dan aktivitas terbaru.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/manekin")}
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1D4ED8] transition-colors"
        >
          Kelola Manekin <ArrowRight size={18} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Booking"
          value={String(stats.total)}
          subtitle="Akumulasi semua booking"
          icon={<ClipboardList size={18} />}
        />
        <StatCard
          title="Transaksi Sukses"
          value={String(rows.filter((r) => r.status_pembayaran === "terverifikasi").length)}
          subtitle="Status terverifikasi"
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          title="Total Pendapatan"
          value={stats.pendapatan}
          subtitle="Semua transaksi sukses"
          icon={<Wallet size={18} />}
        />
        <StatCard
          title="Rata-Rata Ticket"
          value={`Rp ${stats.rataTicket}`}
          subtitle="Pendapatan rata-rata / transaksi"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Overview (Bar) */}
        <div
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 xl:col-span-2 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Sales Overview</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Breakup (Donut) + Monthly Earnings (Area) */}
        <div className="space-y-6">
          <div
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            <h3 className="font-semibold text-gray-700 mb-3">Yearly Breakup</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                  >
                    {donutData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: "0.15s" }}
          >
            <h3 className="font-semibold text-gray-700 mb-3">Monthly Earnings</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="earning" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-6 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700">Latest Bookings</h3>
        </div>
        {loading ? (
          <p className="text-gray-500">Memuat…</p>
        ) : rows.length === 0 ? (
          <p className="text-gray-500">Belum ada data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2">Tanggal</th>
                  <th className="py-2">Durasi</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map((r, idx) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${0.05 * idx}s`, opacity: 0 as any }}
                  >
                    <td className="py-2">{r.tanggal_sewa}</td>
                    <td className="py-2">{r.durasi_sewa} hari</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          r.status_pembayaran === "terverifikasi"
                            ? "bg-green-100 text-green-700"
                            : r.status_pembayaran === "batal"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status_pembayaran}
                      </span>
                    </td>
                    <td className="py-2 text-[#F59E0B] font-semibold">
                      {"Rp " +
                        (((r.manekin?.harga_sewa || 0) * r.durasi_sewa) as number).toLocaleString(
                          "id-ID"
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tailwind keyframes (fadeIn) — jika belum ada di CSS, ini bergantung Tailwind v4 preset */}
      {/* Jika perlu manual, tambahkan di CSS global: 
        @keyframes fadeIn { from {opacity:0; transform: translateY(4px)} to {opacity:1; transform:none} }
      */}
    </AdminLayout>
  );
}
