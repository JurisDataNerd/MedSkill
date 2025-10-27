import { useEffect, useState } from "react";
import { getAllManekin } from "../lib/rentalService";
import Footer from "../components/Footer";
import { MessageCircle, X } from "lucide-react";

const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1fTaBOuwMQGHtAVowpGL_cWJ6W7RZWoqhaZGiCDTpTdw/edit?usp=sharing";
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

function RentalNoticeModal({ onClose }: { onClose: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-0">
      <div className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl bg-gradient-to-b from-white to-[#F6FAFF] border border-white/60 overflow-hidden">
        <button
          aria-label="Tutup"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-5 pt-8 pb-6 sm:px-6">
          <div className="flex justify-center">
            <img
              src="/maskot1.png"
              alt="Maskot MedSkill"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain animate-[bounce_2s_infinite]"
            />
          </div>

          <div className="text-center mt-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#1E3A8A]">
              Selamat Datang di Sewa Manekin MedSkill
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Halo kak, senang bisa membantu! Mohon baca beberapa ketentuan di bawah ini.
            </p>
          </div>

          <div className="mt-4 sm:mt-5 max-h-[45vh] overflow-y-auto pr-1">
            <ol className="list-decimal list-inside space-y-2 text-[0.9rem] sm:text-[0.95rem] text-gray-700 leading-relaxed">
              <li>Jam operasional admin pukul 08.00–22.00 WIB.</li>
              <li>Pemesanan maksimal H-1.</li>
              <li>
                Sewa manekin dibatasi pukul 06.00–24.00. Pemesanan melewati 24.00 wajib
                dipesan hingga minimal pukul 06.00 pagi berikutnya.
              </li>
              <li>Perubahan lokasi pengiriman maksimal H-1 sebelum jam 22.00.</li>
              <li>Semua transaksi hanya melalui akun <b>MEDSKILL</b>.</li>
            </ol>

            <p className="mt-4 text-xs sm:text-sm text-gray-600 text-center">
              Terima kasih. Selamat datang di <b>MEDSKILL</b> — tempat untuk{" "}
              <i>upgrade your skills</i>!
            </p>
          </div>

          <div className="mt-4 sm:mt-5">
            <label className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span>Saya menyetujui dan memahami seluruh ketentuan di atas.</span>
            </label>

            <button
              disabled={!checked}
              onClick={onClose}
              className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition ${
                checked
                  ? "bg-[#2563EB] hover:bg-[#1D4ED8]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Mulai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RentalCatalog() {
  const [items, setItems] = useState<Manekin[]>([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [showNotice, setShowNotice] = useState(true);

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
      {showNotice && <RentalNoticeModal onClose={() => setShowNotice(false)} />}

      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-[30rem] sm:w-[36rem] h-[30rem] sm:h-[36rem] rounded-full bg-[#E7F0FF]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 w-[40rem] sm:w-[48rem] h-[40rem] sm:h-[48rem] rounded-full bg-[#F3F4F6]"
      />

      {/* Header */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E3A8A] animate-[fadeIn_0.35s_ease-out_forwards]">
            Katalog Sewa Manekin
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-2xl">
            Pilih perangkat praktik medis yang sesuai kebutuhan Anda. Harga tersedia
            untuk periode <span className="font-medium">3 jam</span> dan{" "}
            <span className="font-medium">per hari</span>. Ketuk kartu untuk melihat
            deskripsi.
          </p>
        </div>
      </section> 

      {/* Grid */}
      <section className="relative pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-gray-600">Memuat katalog…</div>
          ) : items.length === 0 ? (
            <div className="text-gray-600">Belum ada data manekin.</div>
          ) : (
            <div className="grid gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 md:grid-cols-3">
              {items.map((m, idx) => {
                const isFlipped = !!flipped[m.id];
                return (
                  <div
                    key={m.id}
                    className="group [perspective:1200px] animate-[fadeIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div
                      className={`relative h-[22rem] sm:h-[23rem] rounded-2xl border border-gray-100 shadow-sm transition-transform duration-500 [transform-style:preserve-3d]
                                  hover:-translate-y-0.5 hover:shadow-md
                                  ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                      onClick={() => toggleFlip(m.id)}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] bg-white">
                        {m.foto_url ? (
                          <img
                            src={m.foto_url}
                            alt={m.nama_manekin}
                            className="w-full h-44 sm:h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-44 sm:h-48 bg-gray-100" />
                        )}
                        <div className="p-4 sm:p-5">
                          <h3 className="font-semibold text-base sm:text-lg text-[#111827] line-clamp-1">
                            {m.nama_manekin}
                          </h3>
                          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                              <div className="text-[11px] sm:text-xs text-gray-500">
                                Per 3 jam
                              </div>
                              <div className="font-semibold text-[#111827] text-sm sm:text-base">
                                {currency(m.harga_sewa_per_3_jam)}
                              </div>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                              <div className="text-[11px] sm:text-xs text-gray-500">
                                Per hari
                              </div>
                              <div className="font-semibold text-[#111827] text-sm sm:text-base">
                                {currency(m.harga_sewa_per_hari)}
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-[11px] sm:text-xs text-gray-500 hidden md:block">
                            Ketuk kartu untuk melihat deskripsi
                          </p>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <h3 className="font-semibold text-base sm:text-lg text-[#111827]">
                          {m.nama_manekin}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed max-h-[10rem] overflow-y-auto">
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

                    {/* Tip kecil mobile */}
                    <div className="mt-1 text-[11px] text-gray-500 text-center md:hidden">
                      Ketuk kartu untuk melihat deskripsi
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm sm:text-base"
              >
                Cek Ketersediaan Alat
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5" />
                Chat Admin
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
