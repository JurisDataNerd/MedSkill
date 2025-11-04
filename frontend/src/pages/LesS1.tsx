import { useState } from "react";
import {
  BookOpenCheck,
  MapPin,
  Clock3,
  ListChecks,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import Footer from "../components/Footer";

type TabKey = "materi" | "osce";

const WA_LINK =
  "https://wa.me/6280000000000?text=Halo%20Admin,%20saya%20ingin%20bertanya%20tentang%20Les%20S1";

const currency = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID");

export default function LesS1() {
  const [tab, setTab] = useState<TabKey>("materi");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-[fadeIn_0.4s_ease-out_forwards]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E3A8A]">
              Les S1 MedSkill
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-2xl">
              Pilih jenis kelas yang dibutuhkan dengan jadwal fleksibel dan opsi online/offline.
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-5 sm:mt-6 inline-flex flex-wrap rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setTab("materi")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                tab === "materi"
                  ? "bg-[#1E3A8A] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Kelas Materi
            </button>
            <button
              onClick={() => setTab("osce")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                tab === "osce"
                  ? "bg-[#1E3A8A] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Kelas OSCE
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="grow relative">
        {tab === "materi" ? <MateriSection /> : <OsceSection />}
      </main>

      <Footer />
    </div>
  );
}

/* ==============================
   SECTIONS
================================ */

function MateriSection() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Info cards */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3 animate-[fadeIn_0.5s_ease-out_forwards]">
          <InfoCard
            icon={<BookOpenCheck className="w-6 h-6" />}
            title="Materi"
            desc="Tentukan sesuai kebutuhan kamu."
          />
          <InfoCard
            icon={<MapPin className="w-6 h-6" />}
            title="Lokasi"
            desc="Offline di tempatmu atau Online via Zoom."
          />
          <InfoCard
            icon={<Clock3 className="w-6 h-6" />}
            title="Jumlah Sesi"
            desc="Jadwal fleksibel • 3 jam/sesi."
          />
        </div>

        {/* Materi + Pricing */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="font-semibold text-[#111827]">Materi yang bisa dipilih</h3>
            </div>
            <ul className="mt-3 space-y-2 text-gray-700 text-sm sm:text-base">
              {[
                "Lecture",
                "Ujian blok",
                "Ujian praktikum",
                "Ujian SOCA",
                "PBL/Tutorial",
              ].map((m) => (
                <li key={m} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E3A8A]" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl bg-blue-50 text-blue-800 px-4 py-3 text-sm sm:text-base">
              Tersedia juga paket <span className="font-semibold">bundle 10 sesi</span>.
            </div>
          </div>

          {/* Pricing table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-[fadeIn_0.7s_ease-out_forwards]">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-[#111827] text-base sm:text-lg">
                Harga per sesi
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Offline & Online</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-gray-50 text-gray-600 text-xs sm:text-sm">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Jumlah Orang</th>
                    <th className="py-3 px-4 sm:px-6">Offline</th>
                    <th className="py-3 px-4 sm:px-6">Online</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {[
                    { j: "1", off: 500000, on: 400000 },
                    { j: "2", off: 300000, on: 250000, suffix: "/orang" },
                    { j: "3–5", off: 200000, on: 175000, suffix: "/orang" },
                  ].map((r) => (
                    <tr key={r.j} className="border-t">
                      <td className="py-3 px-4 sm:px-6">{r.j} Orang</td>
                      <td className="py-3 px-4 sm:px-6">
                        {currency(r.off)}
                        {r.suffix ? <span className="text-gray-500"> {r.suffix}</span> : null}
                      </td>
                      <td className="py-3 px-4 sm:px-6">
                        {currency(r.on)}
                        {r.suffix ? <span className="text-gray-500"> {r.suffix}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <CtaBar />
      </div>
    </section>
  );
}

function OsceSection() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Pricing OSCE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-[#111827] text-base sm:text-lg">
              Harga Kelas per Sesi (3 jam)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-gray-50 text-gray-600 text-xs sm:text-sm">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Jumlah Orang</th>
                  <th className="py-3 px-4 sm:px-6">Harga / orang</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {[
                  { j: "2 Orang", h: 400000 },
                  { j: "3 Orang", h: 300000 },
                  { j: "4–5 Orang", h: 250000 },
                  { j: "6–7 Orang", h: 200000 },
                  { j: "8–9 Orang", h: 175000 },
                  { j: "10 Orang", h: 150000 },
                ].map((r) => (
                  <tr key={r.j} className="border-t">
                    <td className="py-3 px-4 sm:px-6">{r.j}</td>
                    <td className="py-3 px-4 sm:px-6">{currency(r.h)}/orang</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-6 py-4 text-xs sm:text-sm text-gray-600 border-t">
            *Hubungi admin untuk jumlah orang berbeda.
          </p>
        </div>

        {/* Cards: Lokasi & Pendaftaran */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 mt-8">
          <InfoCard
            icon={<MapPin className="w-6 h-6" />}
            title="Lokasi"
            desc={
              <>
                Bisa sesuai keinginan kamu, <span className="italic">atau</span> disediakan oleh
                MedSkill (online/offline).
              </>
            }
          />
          <InfoCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Pendaftaran"
            desc={
              <>
                Hubungi <span className="italic">WhatsApp</span>  admin.
              </>
            }
          />
        </div>

        {/* CTA */}
        <CtaBar />
      </div>
    </section>
  );
}

/* ==============================
   SMALL COMPONENTS
================================ */

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-sm sm:text-base">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#E7F0FF] text-[#1E3A8A]">{icon}</div>
        <h3 className="font-semibold text-[#111827]">{title}</h3>
      </div>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  );
}

function CtaBar() {
  return (
    <div className="mt-10 sm:mt-12 flex items-center justify-center">
      <a
        href={WA_LINK}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors shadow-sm text-sm sm:text-base"
      >
        <MessageCircle className="w-5 h-5" />
        Chat Admin untuk Pendaftaran
      </a>
    </div>
  );
}
