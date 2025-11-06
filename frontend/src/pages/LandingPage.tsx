import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveHotTopics } from "../lib/hotTopicService";
import Footer from "../components/Footer";
import "../index.css";
import { GraduationCap, BookOpen, Brain, Stethoscope } from "lucide-react";
import { useAuthModal } from "../context/AuthContext";
import { Flame, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { openAuthModal } = useAuthModal();
  const [, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const sectionsRef = useRef<NodeListOf<HTMLElement> | null>(null);

  // --- Fetch dari Supabase ---
  const [hotTopics, setHotTopics] = useState<
    { id: string; title: string; description: string; img: string; link: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotTopics = async () => {
      setLoading(true);
      const data = await getActiveHotTopics();
      setHotTopics(data);
      setLoading(false);
    };
    fetchHotTopics();
  }, []);

  // --- Observer animasi fade-in ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsRef.current = document.querySelectorAll(".fade-in-section");
    sectionsRef.current.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const mentors = [
    { name: "dr. Claresta Lumi", position: "CBT UKMPPD 89", img: "/mentor1.png" },
    { name: "dr. Maura Andini", position: "CBT UKMPPD 94", img: "/mentor2.png" },
    { name: "dr. Laila Khairunnisa Amini", position: "CBT UKMPPD 94", img: "/mentor3.png" },
    { name: "dr. Nadira Chandrasa Mahadewi", position: "CBT UKMPPD 95.3", img: "/mentor4.png" },
    { name: "dr. Najla Mumtaza", position: "CBT UKMPPD 96", img: "/mentor5.png" },
    { name: "dr. Ofadhani Afwan", position: "CBT UKMPPD 90", img: "/mentor6.png" },
    { name: "dr. Angelie Tirza Suryanto", position: "CBT UKMPPD 92.6", img: "/mentor7.png" },
    { name: "dr. Sarah Salsabila", position: "CBT UKMPPD 91.3", img: "/mentor8.png" },
    { name: "dr. Muhammad Aldo Fausta", position: "CBT UKMPPD 91.3", img: "/mentor9.png" },
    { name: "dr. Rizkiqo Pandai Hamukti", position: "CBT UKMPPD 95.3", img: "/mentor10.png" },
    { name: "dr. Ketut Shri Satya Wiwekananda", position: "CBT UKMPPD 90", img: "/mentor11.png" },
    { name: "dr. Rezky Ilham Yudhasaputra", position: "CBT UKMPPD 87.33", img: "/mentor12.png" },
    { name: "dr. Aurelia Priscilla Regita Putri", position: "CBT UKMPPD 87", img: "/mentor13.png" },
  ];

  return (
    <div className="bg-white text-[#111827]">
      {/* HERO */}
      <section
        id="hero"
        className="relative overflow-hidden pt-28 md:pt-32 pb-16 md:pb-24 fade-in-section"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#93C5FD_1px,transparent_0)] bg-size-[20px_20px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1E3A8A]">
                MedSkill <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#1E3A8A]">
                  Solusi Lengkap Belajar Kedokteran
                </span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Platform terpercaya untuk menemani perjalanan anda di Kedokteran. Program kami :
              </p>
              <br />
              <p>Les S1 | Bimbel UKMPPD | Sewa Manekin</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setIsRegister(false);
                    openAuthModal();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm transition"
                >
                  Bergabung dengan kami
                </button>
                <button
                  onClick={() => scrollToId("hot-topic")}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                >
                  Pelajari lebih lanjut
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-6 rounded-4xl bg-linear-to-tr from-[#E7F0FF] to-transparent blur-2xl"
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

      {/* HOT TOPIC */}
      <section
        id="hot-topic"
        className="relative py-20 overflow-hidden bg-linear-to-b from-[#F9FAFB] via-[#F9FBFF] to-white text-[#1E3A8A] fade-in-section"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(96,165,250,0.08),transparent_70%)]"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="w-7 h-7 text-blue-500 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-indigo-700 bg-clip-text text-transparent">
                Hot Topic
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Program bimbingan dan event unggulan dengan kesempatan terbatas update
              terbaru yang paling diminati peserta MedSkill!
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Memuat hot topic...</p>
          ) : hotTopics.length === 0 ? (
            <p className="text-center text-gray-500">
              Belum ada hot topic aktif saat ini.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={topic.img || "/placeholder.jpg"}
                      alt={topic.title}
                      className="w-full h-48 object-center object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1E3A8A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg md:text-xl font-bold text-[#1E3A8A] mb-2 group-hover:text-[#2563EB] transition-colors duration-200">
                      {topic.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {topic.description}
                    </p>

                    <button
                      onClick={() => navigate(topic.link || "#")}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:shadow-md hover:brightness-105 transition-all"
                    >
                      Daftar Sekarang
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY SECTION */}
      <section
        id="why"
        className="py-20 bg-linear-to-b from-white via-[#F9FBFF] to-white fade-in-section"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] mb-3">
              Kenapa <span className="text-blue-600">MedSkill?</span>
            </h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Solusi lengkap untuk pembelajaran dan praktik keterampilan medis
              dengan pendekatan modern, mentor ahli, dan fasilitas berbasis teknologi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <GraduationCap className="w-10 h-10 text-blue-600" />,
                title: "Mentor Terpercaya",
                desc: "Dibimbing oleh dokter, dari universitas ternama di Indonesia.",
              },
              {
                icon: <BookOpen className="w-10 h-10 text-emerald-500" />,
                title: "Materi Bermutu",
                desc: "Materi disusun berdasarkan kompetensi terbaru dan guideline nasional maupun internasional.",
              },
              {
                icon: <Brain className="w-10 h-10 text-yellow-500" />,
                title: "Latihan Soal Interaktif",
                desc: "Bank soal selalu diperbarui dan disusun berdasarkan pengalaman ujian sebenarnya.",
              },
              {
                icon: <Stethoscope className="w-10 h-10 text-pink-500" />,
                title: "Manekin Berkualitas",
                desc: "Manekin OSCE berstandar tinggi dengan pengecekan kualitas dan perawatan rutin.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-5 flex items-center justify-center rounded-xl bg-linear-to-br from-white to-gray-50 p-4 w-16 h-16 mx-auto shadow-inner group-hover:shadow-md group-hover:bg-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg text-[#1E3A8A] text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENTOR */}
      <section id="mentor" className="py-20 bg-[#1E3A8A] text-white overflow-hidden fade-in-section">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Mentor Kami</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            Tenaga medis profesional yang berpengalaman dan berdedikasi dalam mendampingi peserta pelatihan MedSkill.
          </p>
          <div className="relative group">
            <div
              id="mentor-scroll"
              className="flex gap-6 min-w-max flex-nowrap animate-scroll group-hover:[animation-play-state:paused] px-2"
            >
              {mentors.concat(mentors).map((mentor, i) => (
                <div
                  key={i}
                  className="shrink-0 w-52 sm:w-56 bg-[#2044B1] rounded-2xl border border-white/10 p-4 text-center hover:bg-[#2563EB] transition-all duration-300 hover:-translate-y-1 shadow-md"
                >
                  <div className="w-full aspect-4/5 overflow-hidden rounded-xl mb-3">
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

     {/* PARTNER */}
<section id="partner" className="py-16 bg-white fade-in-section">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-10">
      Our Partner
    </h2>

    {/* Partner Logo */}
    <div className="flex justify-center items-center">
      <img
        src="/partner1.png"
        alt="Partner"
        className="w-56 sm:w-68 md:w-70 lg:w-68 h-auto object-contain grayscale hover:grayscale-0 transition duration-300"
      />
    </div>
  </div>
</section>


      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#1E3A8A] fade-in-section">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Siap menjalani kedokteran bersama MedSkill ?
          </h2>
          <p className="text-white/80 mt-2">
            Bimbel S1 | Bimbel UKMPPD | Sewa Manekin OSCE
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

      <Footer />
    </div>
  );
}
