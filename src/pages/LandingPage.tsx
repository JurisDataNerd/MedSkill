import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer"

type Manekin = {
  id: string;
  nama_manekin: string;
  harga_sewa: number;
  foto_url: string | null;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [manekins, setManekins] = useState<Manekin[]>([]);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax listener (ringan)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ambil katalog untuk carousel
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("manekin")
        .select("id, nama_manekin, harga_sewa, foto_url")
        .order("created_at", { ascending: false })
        .limit(12);
      if (data) setManekins(data as Manekin[]);
    })();
  }, []);

  const layer1 = useMemo(() => `translateY(${scrollY * 0.15}px)`, [scrollY]);
  const layer2 = useMemo(() => `translateY(${scrollY * 0.08}px)`, [scrollY]);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white text-[#111827]">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-28 md:pt-32 pb-16 md:pb-24"
      >
        {/* Parallax background shapes */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-[#E7F0FF]"
          style={{ transform: layer2 }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-40 w-[48rem] h-[48rem] rounded-full bg-[#F3F4F6]"
          style={{ transform: layer1 }}
        />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Copy */}
            <div className="opacity-0 animate-fadeIn">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1E3A8A]">
                Tingkatkan Skill Medis Anda <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1E3A8A]">
                  bersama MedSkill
                </span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                LMS terpadu dengan rental manekin, kursus, dan bimbingan praktis.
                Kurasi materi berkualitas dan praktik langsung dengan perangkat medis yang sesuai standar.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/rental")}
                  className="px-6 py-3 rounded-xl text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-sm"
                >
                  Mulai Rental Manekin
                </button>
                <button
                  onClick={() => scrollToId("fitur")}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Pelajari Lebih Lanjut
                </button>
              </div>

              {/* Social proof kecil */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#E5EDFF] border" />
                  <div className="w-8 h-8 rounded-full bg-[#FFEFD5] border" />
                  <div className="w-8 h-8 rounded-full bg-[#DEF7EC] border" />
                </div>
                <p className="text-sm text-gray-600">
                  Dipercaya oleh ribuan peserta pelatihan
                </p>
              </div>
            </div>

            {/* Mascot */}
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-[#E7F0FF] to-transparent blur-2xl"
                style={{ transform: layer2 }}
                aria-hidden
              />
              <img
                src="/MedSkill.png"
                alt="Maskot MedSkill"
                className="relative w-[86%] md:w-[78%] mx-auto drop-shadow-xl opacity-0 animate-[fadeIn_0.7s_ease-out_forwards] [animation-delay:120ms]"
                style={{ transform: layer1 }}
              />
              {/* Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border rounded-2xl px-4 py-2 shadow-sm flex gap-3 items-center opacity-0 animate-[fadeIn_0.7s_ease-out_forwards] [animation-delay:260ms]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                <span className="text-sm text-gray-700">
                  Maskot MedSkill siap mendampingi belajar Anda
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="py-14 md:py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A]">Kenapa MedSkill?</h2>
            <p className="mt-2 text-gray-600">
              Solusi end-to-end untuk pembelajaran dan praktik keterampilan medis.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                title: "Rental Manekin",
                desc: "Perangkat praktik medis berstandar, siap digunakan untuk pembelajaran.",
              },
              {
                title: "Kursus Terstruktur",
                desc: "Kurikulum dari praktisi dan institusi terpercaya.",
              },
              {
                title: "Bimbingan Praktik",
                desc: "Sesi hands-on dan mentoring dengan instruktur.",
              },
              {
                title: "Sertifikasi",
                desc: "Dokumentasi kompetensi untuk kredibilitas profesional.",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#E7F0FF] border border-[#D8E6FF] mb-4" />
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-gray-600 mt-1 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATALOG POPULER (Carousel) */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A8A]">
                Manekin Terpopuler
              </h2>
              <p className="text-gray-600 mt-1">
                Koleksi pilihan yang paling sering disewa peserta.
              </p>
            </div>
            <button
              onClick={() => navigate("/rental")}
              className="hidden md:inline-block px-4 py-2 rounded-xl border hover:bg-gray-50 transition-colors"
            >
              Lihat Semua
            </button>
          </div>

          {/* Scroll-snap carousel */}
          <div className="relative">
            <div
              className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: "none" } as any}
            >
              {manekins.map((m, idx) => (
                <article
                  key={m.id}
                  className="min-w-[260px] max-w-[260px] snap-start bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {m.foto_url ? (
                    <img
                      src={m.foto_url}
                      alt={m.nama_manekin}
                      className="w-full h-40 object-cover rounded-t-2xl"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-t-2xl" />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{m.nama_manekin}</h3>
                    <p className="text-[#F59E0B] font-semibold mt-1">
                      Rp {m.harga_sewa.toLocaleString("id-ID")} / hari
                    </p>
                    <button
                      onClick={() => navigate(`/booking/${m.id}`)}
                      className="mt-4 w-full px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
                    >
                      Ajukan Sewa
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center md:hidden">
            <button
              onClick={() => navigate("/rental")}
              className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition-colors"
            >
              Lihat Semua
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT + PARALLAX MINI */}
      <section className="py-16 md:py-24 bg-[#F9FAFB] relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-24 top-10 w-[28rem] h-[28rem] rounded-full bg-[#E7F0FF]"
          style={{ transform: layer2 }}
        />
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <h2 className="text-3xl font-bold text-[#1E3A8A]">Belajar yang Terarah</h2>
            <p className="text-gray-600 mt-3 leading-relaxed">
              MedSkill memadukan materi yang terstruktur dengan fasilitas praktik nyata.
              Dari kelas teori, demonstrasi, hingga praktik hands-on dengan manekin medis—
              semua di satu platform.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/rental")}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
              >
                Mulai Sekarang
              </button>
              <button
                onClick={() => scrollToId("kontak")}
                className="px-5 py-2.5 rounded-xl border hover:bg-gray-50 transition-colors"
              >
                Hubungi Kami
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div
              className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#E7F0FF] to-transparent blur-2xl"
              style={{ transform: layer1 }}
              aria-hidden
            />
            <img
              src="/landingPageMaskot2.png"
              alt="Maskot MedSkill"
              className="relative w-[70%] md:w-[64%] mx-auto drop-shadow-xl opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONI (carousel ringan) */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A8A] text-center">
            Apa kata mereka
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Testimoni singkat dari peserta yang telah memanfaatkan MedSkill.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {[
              { name: "Aulia", text: "Peralatan lengkap, materi mudah dipahami, dan tim responsif." },
              { name: "Dimas", text: "Booking manekin mudah, pengiriman tepat waktu, kualitas bagus." },
              { name: "Nadia", text: "Belajar jadi menyenangkan karena bisa langsung praktik." },
            ].map((t, i) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="text-gray-700 leading-relaxed">“{t.text}”</p>
                <div className="mt-4 font-semibold">{t.name}</div>
                <div className="text-sm text-gray-500">Peserta</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-24 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Siap meningkatkan keterampilan medis Anda?
          </h2>
          <p className="text-white/80 mt-2">
            Mulai dari menyewa manekin hingga mengikuti kursus terkurasi.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/rental")}
              className="px-6 py-3 rounded-xl bg-white text-[#1E3A8A] hover:bg-gray-100 transition-colors"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
            <Footer />
          </div>
  );
}
