import { useEffect, useState } from "react";
import { getAllManekin } from "../lib/rentalService";
import Footer from "../components/Footer";
import { MessageCircle } from "lucide-react";
  

 // Link Google Sheets untuk cek ketersediaan
const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1fTaBOuwMQGHtAVowpGL_cWJ6W7RZWoqhaZGiCDTpTdw/edit?usp=sharing";
const WHATSAPP_URL = "https://wa.link/jetlp9";

type Manekin = {
  id: string;
  nama_manekin: string;
  deskripsi: string | null;
  harga_sewa_per_hari: number | null;
  harga_sewa_per_3_jam: number | null;
  foto_url: string | null;
};

const currency = (n: number | null | undefined) =>
  "Rp " + (n ?? 0).toLocaleString("id-ID");

// =====================================================
// ✅ MODAL COMPONENT (KETENTUAN RENTAL)
// =====================================================
function RentalNoticeModal({ onAgree }: { onAgree: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative animate-[fadeIn_0.3s_ease]">
        {/* Konten */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Maskot */}
          <img
            src="/maskot.png"
            alt="MedSkill Mascot"
            className="w-32 h-32 object-contain animate-[bounce_2s_infinite]"
          />

          {/* Pesan */}
          <div className="text-gray-700 text-sm leading-relaxed">
            <p className="font-semibold mb-2">
              Halo kak, senang bisa membantu kakak, berikut beberapa hal yang perlu diperhatikan :
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Jam operasional admin pukul 08.00-22.00 WIB</li>
              <li>Pemesanan maksimal H-1</li>
              <li>
                Sewa manekin kami batasi dari pukul 06.00-24.00, pemesanan hingga diatas pukul 24.00
                wajib memesan sampai minimal pukul 06.00 pagi besoknya
              </li>
              <li>Perubahan lokasi pengiriman maksimal H-1 sebelum jam 22.00</li>
              <li>Semua transaksi hanya melalui akun MEDSKILL</li>
            </ol>
            <p className="mt-3 font-medium">
              Sekian terimakasih kak, selamat datang di MEDSKILL, tempat untuk upgrade your skills!
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            id="agree"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            Saya menyetujui dan memahami ketentuan di atas.
          </label>
        </div>

        {/* Button */}
        <button
          disabled={!checked}
          onClick={onAgree}
          className={`mt-4 w-full py-2 rounded-xl text-white font-semibold transition ${
            checked
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Mulai
        </button>
      </div>
    </div>
  );
}

// =====================================================
// ✅ RENTAL CATALOG HALAMAN UTAMA
// =====================================================
export default function RentalCatalog() {
  const [items, setItems] = useState<Manekin[]>([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("rental_notice_accepted");
    if (!accepted) {
      setShowNotice(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("rental_notice_accepted", "true");
    setShowNotice(false);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getAllManekin();
      setItems(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const toggleFlip = (id: string) =>
    setFlipped((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="relative min-h-screen bg-white">
      {/* ✅ Modal (tampil kalau belum agree) */}
      {showNotice && <RentalNoticeModal onAgree={handleAgree} />}

      {/* Background lembut ala landing */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-[#E7F0FF]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 w-[48rem] h-[48rem] rounded-full bg-[#F3F4F6]" />

      {/* Header */}
      <section className="relative pt-28 md:pt-32 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="opacity-0 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A]">
              Katalog Rental Manekin
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Pilih perangkat praktik medis yang sesuai kebutuhan Anda.
              Harga tersedia untuk periode <span className="font-medium">3 jam</span> dan{" "}
              <span className="font-medium">per hari</span>. Klik kartu untuk melihat deskripsi.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Katalog */}
      <section className="relative pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-gray-600">Memuat katalog…</div>
          ) : items.length === 0 ? (
            <div className="text-gray-600">Belum ada data manekin.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m, idx) => {
                const isFlipped = !!flipped[m.id];
                return (
                  <div
                    key={m.id}
                    className="group [perspective:1200px] opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div
                      className={`relative h-[22rem] rounded-2xl border border-gray-100 shadow-sm transition-transform duration-500 [transform-style:preserve-3d] hover:-translate-y-0.5 hover:shadow-md ${
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                      }`}
                      onClick={() => toggleFlip(m.id)}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] bg-white">
                        {m.foto_url ? (
                          <img
                            src={m.foto_url}
                            alt={m.nama_manekin}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100" />
                        )}
                        <div className="p-5">
                          <h3 className="font-semibold text-lg text-[#111827] line-clamp-1">
                            {m.nama_manekin}
                          </h3>
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
                          <p className="mt-3 text-xs text-gray-500 hidden md:block">
                            Arahkan kursor atau klik untuk melihat deskripsi
                          </p>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 rounded-2xl border border-gray-100 bg-white p-5 [transform:rotateY(180deg)] [backface-visibility:hidden] [transform-style:preserve-3d]">
                        <h3 className="font-semibold text-lg text-[#111827]">
                          {m.nama_manekin}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                          {m.deskripsi || "Belum ada deskripsi."}
                        </p>
                        <div className="absolute bottom-5 left-5 right-5">
                          <div className="grid grid-cols-2 gap-3">
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
                      </div>
                    </div>

                    {/* tip kecil di mobile */}
                    <div className="mt-2 text-xs text-gray-500 md:hidden">
                      Ketuk kartu untuk melihat deskripsi
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA bawah */}
          {!loading && items.length > 0 && (
            <div className="mt-12 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 bg-white/90 backdrop-blur hover:bg-gray-50 transition-colors"
              >
                Cek Ketersediaan Alat
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Chat Admin untuk Pemesanan
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
