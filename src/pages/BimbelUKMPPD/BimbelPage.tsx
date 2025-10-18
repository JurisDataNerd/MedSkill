import { useState } from "react";
import TryOutSection from "./components/TryOutSection";

type TabKey = "kos" | "materi" | "osce" | "tryout";

const tabs: { key: TabKey; label: string }[] = [
  { key: "kos", label: "KOS / SOS" },
  { key: "materi", label: "Materi" },
  { key: "osce", label: "OSCE" },
  { key: "tryout", label: "Try Out" },
];

export default function BimbelPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("kos");

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* HEADER */}
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">
          Bimbel UKMPPD
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Pilih jenis program bimbingan yang sesuai: KOS/SOS, Materi per topik atau Full Course,
          latihan OSCE, hingga Try Out dengan jadwal dan leaderboard.
        </p>
      </section>

      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[300px] bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
        {activeTab === "kos" && (
          <div>
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">
              Kelas Online Singkat (KOS) & Soal Online Singkat (SOS)
            </h2>
            <p className="text-gray-600">
              Konten placeholder. Nanti di sini akan ada daftar KOS & SOS,
              lengkap dengan deskripsi, pengajar, harga, dan tombol Chat Admin / Form Pendaftaran.
            </p>
          </div>
        )}

        {activeTab === "materi" && (
          <div>
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">
              Materi Per Topik & Full Course
            </h2>
            <p className="text-gray-600">
              Konten placeholder. Nanti akan ada:
              <br />• Banner Full Course 14x Pertemuan (Rp 2.500.000)
              <br />• Daftar 14 materi berbeda + pengajar + tombol "Daftar Materi (Rp 250k)"
              <br />• Semua diarahkan ke GForm sesuai instruksi klien.
            </p>
          </div>
        )}

        {activeTab === "osce" && (
          <div>
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">
              OSCE
            </h2>
            <p className="text-gray-600">
              Konten placeholder. Struktur UI nanti mirip Les S1 OSCE, 
              tinggal inject konten dari klien (materi skill, pengajar, dll).
            </p>
          </div>
        )}

        {activeTab === "tryout" && <TryOutSection />}
      </div>
    </main>
  );
}
