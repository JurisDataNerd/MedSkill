import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthModal } from "../context/AuthContext"; // ✅ TAMBAHAN

export default function Navbar() {
  const { showAuthModal, openAuthModal, closeAuthModal } = useAuthModal(); // ✅ GANTI state lokal
  const [session, setSession] = useState<any>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Pantau session aktif
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  // ✅ Validasi kekuatan password
  const isPasswordStrong = (password: string) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return strongRegex.test(password);
  };

  // ✅ Fungsi Login / Register
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("❌ Password dan konfirmasi tidak cocok.");
        setLoading(false);
        return;
      }
      if (!isPasswordStrong(password)) {
        setError(
          "⚠️ Password minimal 8 karakter, mengandung huruf besar, kecil, angka, dan simbol."
        );
        setLoading(false);
        return;
      }

      // ✅ Supabase akan otomatis kirim email konfirmasi
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/verify-success",
        },
      });

      if (error) {
        setError("❌ " + error.message);
      } else {
        setSuccess(
          "📩 Akun berhasil dibuat! Cek email kamu dan klik tautan verifikasi sebelum login."
        );
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("❌ " + error.message);
      } else if (!data.session?.user.email_confirmed_at) {
        // belum verifikasi
        setError("⚠️ Email belum diverifikasi. Silakan cek email kamu.");
        await supabase.auth.signOut();
      } else {
        setSuccess("✅ Login berhasil!");
        closeAuthModal(); // ✅ TUTUP modal
      }
    }

    setLoading(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    alert("👋 Logout berhasil!");
    if (location.pathname.startsWith("/booking") || location.pathname.startsWith("/payment")) {
      navigate("/");
    }
  };

  return (
    <>
      {/* 🔹 NAVBAR */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10 px-6 py-3 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-[#1E3A8A] cursor-pointer"
        >
          MedSkill 
        </h1>

        <div className="flex gap-5 items-center">
          <button
            onClick={() => navigate("/")}
            className={`hover:text-[#1E3A8A] ${
              location.pathname === "/" ? "text-[#1E3A8A]" : "text-gray-700"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/les/s1")}
            className={`hover:text-[#1E3A8A] ${
              location.pathname === "/les/s1" ? "text-[#1E3A8A]" : "text-gray-700"
            }`}
          >
            Les S1
          </button>

          <button
            onClick={() => navigate("/rental")}
            className={`hover:text-[#1E3A8A] ${
              location.pathname === "/rental" ? "text-[#1E3A8A]" : "text-gray-700"
            }`}
          >
            Sewa Manekin
          </button>

          {!session ? (
            <button
              onClick={() => {
                setIsRegister(false);
                openAuthModal(); // ✅ GANTI
              }}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-1.5 rounded-lg"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-gray-700 text-sm">
                👤 {session.user.email}
              </p>
              <button
                onClick={handleLogout}
                className="border border-gray-400 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 🔹 AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 border border-gray-200 rounded-2xl shadow-xl p-8 w-[370px] relative backdrop-blur-md transition-all">
            <button
              onClick={() => {
                closeAuthModal(); // ✅ GANTI
                setError("");
                setSuccess("");
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-black"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4 text-center">
              {isRegister ? " Register Akun" : " Login Akun"}
            </h2>

            {error && (
              <p className="bg-red-100 text-red-600 px-3 py-2 rounded mb-3 text-sm text-center">
                {error}
              </p>
            )}

            {success && (
              <p className="bg-green-100 text-green-700 px-3 py-2 rounded mb-3 text-sm text-center">
                {success}
              </p>
            )}

            <form onSubmit={handleAuth}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded-lg px-3 py-2 w-full mb-3"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border rounded-lg px-3 py-2 w-full mb-3"
              />

              {isRegister && (
                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border rounded-lg px-3 py-2 w-full mb-3"
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full py-2 rounded-lg transition-all"
              >
                {loading
                  ? "Memproses..."
                  : isRegister
                  ? "Daftar Sekarang"
                  : "Login"}
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4 text-center">
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setSuccess("");
                }}
                className="text-[#2563EB] hover:underline"
              >
                {isRegister ? "Login di sini" : "Daftar di sini"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
