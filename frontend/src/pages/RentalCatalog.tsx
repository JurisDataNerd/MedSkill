import { useEffect, useState } from "react";
import { getAllManekin } from "../lib/rentalService";
import Footer from "../components/Footer";
import { X, MessageCircle, ZoomIn } from "lucide-react";

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

// ===================================================
// Modal Pop-up untuk gambar detail manekin
// ===================================================
function ImagePopup({
  manekin,
  onClose,
}: {
  manekin: Manekin | null;
  onClose: () => void;
}) {
  if (!manekin) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
      <div className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
        <button
          aria-label="Tutup"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={manekin.foto_url || "/placeholder.png"}
          alt={manekin.nama_manekin}
          className="w-full h-56 sm:h-64 object-cover"
        />
        <div className="p-5">
          <h2 className="text-lg font-bold text-[#1E3A8A]">
            {manekin.nama_manekin}
          </h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {manekin.deskripsi || "Belum ada deskripsi."}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <div className="text-xs text-gray-500">Per 3 jam</div>
              <div className="font-semibold text-[#111827]">
                {currency(manekin.harga_sewa_per_3_jam)}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <div className="text-xs text-gray-500">Per hari</div>
              <div className="font-semibold text-[#111827]">
                {currency(manekin.harga_sewa_per_hari)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================
// Modal notice awal
// ===================================================
function RentalNoticeModal({ onClose }: { onClose: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3">
      <div className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl bg-gradient-to-b from-white to-[#F6FAFF] border border-white/60 overflow-hidden">
        <button
          aria-label="Tutup"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-5 pt-8 pb-6">
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
              Mohon baca beberapa ketentuan di bawah ini sebelum melanjutkan.
            </p>
          </div>

          <div className="mt-4 max-h-[45vh] overflow-y-auto pr-1">
            <ol className="list-decimal list-inside space-y-2 text-[0.9rem] sm:text-[0.95rem] text-gray-700 leading-relaxed">
              <li>Jam operasional admin pukul 08.00–22.00 WIB.</li>
              <li>Pemesanan maksimal H-1 sebelum hari penyewaan.</li>
              <li>
                Sewa manekin berlaku pukul 06.00–24.00 WIB. Jika melewati batas,
                wajib memesan hingga minimal pukul 06.00 pagi berikutnya.
              </li>
              <li>Perubahan lokasi pengiriman maksimal H-1 pukul 22.00.</li>
              <li>Transaksi resmi hanya melalui akun <b>MEDSKILL</b>.</li>
            </ol>
          </div>

          <label className="mt-4 flex items-start gap-2 text-xs sm:text-sm text-gray-700 select-none">
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
            className={`mt-5 w-full py-3 rounded-xl font-semibold text-white transition ${
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
  );
}

// ===================================================
// Halaman utama
// ===================================================
export default function RentalCatalog() {
  const [items, setItems] = useState<Manekin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Manekin | null>(null);
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {showNotice && <RentalNoticeModal onClose={() => setShowNotice(false)} />}
      {selected && <ImagePopup manekin={selected} onClose={() => setSelected(null)} />}

      <main className="flex-grow pt-24 sm:pt-28 pb-16 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A]">
            Katalog Sewa Manekin
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Pilih perangkat medis sesuai kebutuhan Anda.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">Memuat katalog…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600 text-center">Belum ada data manekin.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => setSelected(m)}
                className="cursor-pointer rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 overflow-hidden bg-white"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative">
                  <img
                    src={m.foto_url || "/placeholder.png"}
                    alt={m.nama_manekin}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-2 right-2 bg-white/80 rounded-full p-2 text-gray-700 hover:text-[#2563EB] transition">
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#111827] line-clamp-1">
                    {m.nama_manekin}
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                      <div className="text-[11px] text-gray-500">Per 3 jam</div>
                      <div className="font-semibold text-sm">
                        {currency(m.harga_sewa_per_3_jam)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                      <div className="text-[11px] text-gray-500">Per hari</div>
                      <div className="font-semibold text-sm">
                        {currency(m.harga_sewa_per_hari)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
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
      </main>

      <Footer />
    </div>
  );
}
