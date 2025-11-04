import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../../components/Footer";

type TabKey = "kos" | "materi" | "osce" | "tryout";

interface BimbelClass {
  id: string;
  title: string;
  description: string;
  mentor_name?: string;
  price?: number;
  img_url?: string;
  gform_link?: string;
  category: string;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "kos", label: "KOS / SOS" },
  { key: "materi", label: "Materi" },
  { key: "osce", label: "OSCE" },
  { key: "tryout", label: "Try Out" },
];

export default function BimbelPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("kos");
  const [comingSoon, setComingSoon] = useState(false);
  const [classes, setClasses] = useState<BimbelClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  // 🔹 Fetch kelas berdasarkan kategori aktif
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const category = activeTab.toUpperCase();
        if (activeTab === "osce" || activeTab === "tryout") {
          setClasses([]);
          setComingSoon(true);
          return;
        }

        const { data, error } = await supabase
          .from("bimbel_classes")
          .select("*")
          .eq("category", category)
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setClasses(data || []);
        setComingSoon(false);
      } catch (err) {
        console.error("Gagal mengambil data kelas:", err);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [activeTab]);

  const handleTabClick = (tab: TabKey) => setActiveTab(tab);

  // 🔹 REPLACEMENT: Modal Popup menggantikan alert()
  const handleDaftarClick = async (link?: string) => {
    if (!link) {
      setModalMessage("Link pendaftaran belum tersedia.");
      setShowModal(true);
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setModalMessage("Silakan login atau register akun terlebih dahulu untuk melanjutkan.");
      setShowModal(true);
      return;
    }

    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* HEADER */}
        <motion.section
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A8A]">
            Bimbel UKMPPD
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Pilih jenis program bimbingan yang sesuai: KOS/SOS, Materi per topik atau
            Full Course, latihan OSCE, hingga Try Out dengan jadwal dan leaderboard.
          </p>
        </motion.section>

        {/* TABS */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* COMING SOON ALERT */}
        {comingSoon && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center">
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-3">🚧 Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                Fitur ini sedang dalam pengembangan. Nantikan pembaruan berikutnya!
              </p>
              <button
                onClick={() => {
                  setComingSoon(false);
                  setActiveTab("kos");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Kembali ke KOS / SOS
              </button>
            </div>
          </motion.div>
        )}

        {/* LOGIN MODAL */}
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md text-center"
            >
              <h2 className="text-xl font-semibold text-[#1E3A8A] mb-3">Perhatian</h2>
              <p className="text-gray-600 mb-6">{modalMessage}</p>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (modalMessage.includes("login")) navigate("/");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Oke
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* CONTENT AREA */}
        {!comingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {loading ? (
              <p className="text-center text-gray-500 mt-6">Memuat kelas...</p>
            ) : classes.length === 0 ? (
              <p className="text-center text-gray-500 mt-6">
                Belum ada kelas aktif pada kategori ini.
              </p>
            ) : (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {classes.map((kelas) => (
                  <motion.div
                    key={kelas.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition bg-white"
                  >
                    <div className="relative">
                      <img
                        src={kelas.img_url || "/placeholder.jpg"}
                        alt={kelas.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        {kelas.mentor_name || "Instruktur MedSkill"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#1E3A8A] mb-2">
                        {kelas.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {kelas.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[#2563EB]">
                          {kelas.price
                            ? `Rp ${kelas.price.toLocaleString("id-ID")}`
                            : "Gratis"}
                        </p>
                        <button
                          onClick={() => handleDaftarClick(kelas.gform_link)}
                          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition"
                        >
                          Daftar Sekarang
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
