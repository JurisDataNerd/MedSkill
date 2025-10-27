import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Footer from "../components/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [currentMentor, setCurrentMentor] = useState(0);

  // Parallax effect
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mentor carousel auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMentor((prev) => (prev + 1) % mentors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const layer1 = useMemo(() => `translateY(${scrollY * 0.15}px)`, [scrollY]);
  const layer2 = useMemo(() => `translateY(${scrollY * 0.08}px)`, [scrollY]);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Dummy Hot Topic data
  const hotTopics = [
    {
      id: 1,
      title: "Kelas Online Singkat (KOS)",
      img: "/hot-kos.jpg",
      desc: "Pelatihan daring intensif berdurasi singkat untuk memperdalam keterampilan medis.",
      link: "#",
    },
    {
      id: 2,
      title: "Soal Online Singkat (SOS)",
      img: "/hot-sos.jpg",
      desc: "Latihan soal berbasis sistem penilaian otomatis. Cocok untuk evaluasi mandiri.",
      link: "#",
    },
  ];

  // Dummy mentor data
  const mentors = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    name: `dr. Nama Mentor ${i + 1}`,
    img: `/mentor${i + 1}.png`,
    category: ["Spesialis Anak", "Spesialis Bedah", "Spesialis Penyakit Dalam", "Spesialis Kebidanan"][i % 4],
    position: ["Senior Mentor", "Clinical Instructor", "Lecturer", "Tutor"][i % 4],
  }));

  // Dummy media partner
  const partners = [
    "/partner1.png",
 
  ];

  return (
    <div className="bg-white text-[#111827]">
      {/* 1️⃣ HERO */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-28 md:pt-32 pb-16 md:pb-24"
      >
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
            {/* Text */}
            <div className="opacity-0 animate-fadeIn">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1E3A8A]">
                MedSkill <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1E3A8A]">
                  Solusi Lengkap Belajar Kedokteran
                </span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Platform terpercaya untuk menemani perjalanan anda di Kedokteran. Program kami :
              </p> <br />
              <p>Les S1 | Bimbel UKMPPD | Sewa Manekin </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToId("hot-topic")}
                  className="px-6 py-3 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm transition"
                >
                  Bergabung dengan kami
                </button>
                <button
                  onClick={() => scrollToId("mentor")}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                >
                  Pelajari lebih lanjut
                </button>
              </div>
            </div>

            {/* Mascot */}
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-[#E7F0FF] to-transparent blur-2xl"
                aria-hidden
              />
              <img
                src="/maskot2.png"
                alt="Maskot MedSkill"
                className="relative w-[86%] md:w-[78%] mx-auto drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ HOT TOPIC */}
      <section
        id="hot-topic"
        className="relative py-20 overflow-hidden bg-[#F9FAFB] text-[#1E3A8A]"
      >
        {/* 💙 Background animasi lembut bertema MedSkill */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[#ffffff]/40 via-[#ffffff]/30 to-[#ffffff]/40
                    animate-[bluePulse_6s_ease-in-out_infinite]"
        />

        <div className="relative max-w-7xl mx-auto px-4">
          <h2
            className="text-4xl md:text-5xl font-extrabold text-center mb-12
                      bg-gradient-to-r from-[#60A5FA] via-[#2563EB] to-[#1E3A8A]
                      bg-clip-text text-transparent animate-[blueFlame_2.5s_ease-in-out_infinite]"
          >
            Hot Topic ⚡
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {hotTopics.map((topic) => (
              <div
                key={topic.id}
                className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={topic.img}
                    alt={topic.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold text-[#1E3A8A] group-hover:text-[#2563EB] transition">
                    {topic.title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    {topic.desc}
                  </p>
                  <button
                    onClick={() => navigate(topic.link)}
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-xl
                              bg-gradient-to-r from-[#2563EB] to-[#1E3A8A]
                              text-white font-medium shadow-sm hover:shadow-md hover:brightness-110 transition"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* 3️⃣ KENAPA MEDSKILL */}
      <section id="why" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A]">
              Kenapa MedSkill?
            </h2>
            <p className="mt-2 text-gray-600">
              Solusi lengkap untuk pembelajaran dan praktik keterampilan medis.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              {
                title: "Mentor Terpercaya",
                desc: "Lulusan terbaik dan kompeten dalam mengajar ",
              },
              {
                title: "Materi Bermutu",
                desc: "Materi ter-update dan terpercaya untuk belajar",
              },
              {
                title: "Latihan Soal Bermutu",
                desc: "Latihan soal ter-update dan relevan dengan ujian Kedokteran.",
              },
              {
                title: "Manekin Berkualitas",
                desc: "Manekin OSCE dengan pengecekan kualitas berkala untuk disewakan",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-[#F9FAFB] rounded-2xl p-6 border hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg text-[#1E3A8A]">{f.title}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* 4️⃣ MENTOR KAMI */}
      <section id="mentor" className="py-20 bg-[#1E3A8A] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Mentor Kami</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            Tenaga medis profesional yang berpengalaman dan berdedikasi dalam mendampingi peserta pelatihan MedSkill.
          </p>

          <div className="relative">
            <div
              id="mentor-scroll"
              className="flex gap-6 min-w-max flex-nowrap animate-scroll px-2"
            >
              {mentors.concat(mentors).map((mentor, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-52 sm:w-56 bg-[#2044B1] rounded-2xl border border-white/10 p-4 text-center
                            hover:bg-[#2563EB] transition-all duration-300 hover:-translate-y-1 shadow-md"
                >
                  <div className="w-full aspect-[4/5] overflow-hidden rounded-xl mb-3">
                    <img
                      src={mentor.img}
                      alt={mentor.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h3 className="text-base font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-white/80 mt-1">{mentor.position}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


        {/* 5️⃣ MEDIA PARTNER */}
        <section id="partner" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-10">
              Our Partner
            </h2>

            <div className="flex justify-center items-center">
              <img
                src="/partner1.png"
                alt="Partner"
                className="w-48 sm:w-56 md:w-60 lg:w-56 h-auto object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          </div>
        </section>

        {/* 6 BERGABUNG BERSAMA KAMI */}
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


      {/* 7 FOOTER */}
      <Footer />
    </div>
  );
}
