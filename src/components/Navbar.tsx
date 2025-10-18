import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthModal } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  // ====== AUTH MODAL & AUTH STATE (TETAP SAMA / TIDAK DIUBAH) ======
  const { showAuthModal, openAuthModal, closeAuthModal } = useAuthModal();
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

  // ====== UI STATE BARU (TAMBAHAN UI SAJA) ======
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ====== SESSION LISTENER (TETAP) ======
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

  // ====== SCROLL SHADOW EFFECT (UI) ======
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ====== LOCK BODY SCROLL SAAT DRAWER TERBUKA (BIAR HALAMAN GAK KE-SCROLL) ======
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  // ====== VALIDASI PASSWORD (TETAP) ======
  const isPasswordStrong = (password: string) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return strongRegex.test(password);
  };

  // ====== LOGIN / REGISTER (TETAP) ======
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
        setError("⚠️ Email belum diverifikasi. Silakan cek email kamu.");
        await supabase.auth.signOut();
      } else {
        setSuccess("✅ Login berhasil!");
        closeAuthModal();
      }
    }

    setLoading(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // ====== LOGOUT (TETAP) ======
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    alert("👋 Logout berhasil!");
    if (
      location.pathname.startsWith("/booking") ||
      location.pathname.startsWith("/payment")
    ) {
      navigate("/");
    }
    setMobileOpen(false); // tutup drawer bila terbuka
  };

  // ====== HELPERS UI ======
  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false); // auto-close drawer
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // ====== RENDER NAVBAR ======
  return (
    <>
      {/* NAVBAR WRAPPER (TRANSPARAN + BLUR + STICKY) */}
      <header
        className={[
          "fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out",
          "bg-white/70 backdrop-blur-md border-b border-white/20",
          scrolled ? "shadow-sm" : "",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO / BRAND */}
            <div
              onClick={() => go("/")}
              className="flex items-center gap-2 cursor-pointer rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400" />
              <span className="text-lg font-semibold tracking-tight text-slate-800">
                MedSkill
              </span>
            </div>

            {/* DESKTOP MENU */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => go("/")}
                className={[
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive("/") ? "text-blue-700 underline underline-offset-8 decoration-2" : "text-slate-700 hover:text-blue-700",
                ].join(" ")}
              >
                Home
              </button>

              <button
                onClick={() => go("/les/s1")}
                className={[
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive("/les/s1") ? "text-blue-700 underline underline-offset-8 decoration-2" : "text-slate-700 hover:text-blue-700",
                ].join(" ")}
              >
                Les S1
              </button>

              {/* TAB BARU: BIMBEL UKMPPD */}
              <button
                onClick={() => go("/bimbel")}
                className={[
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive("/bimbel") ? "text-blue-700 underline underline-offset-8 decoration-2" : "text-slate-700 hover:text-blue-700",
                ].join(" ")}
              >
                Bimbel UKMPPD
              </button>

              <button
                onClick={() => go("/rental")}
                className={[
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive("/rental") ? "text-blue-700 underline underline-offset-8 decoration-2" : "text-slate-700 hover:text-blue-700",
                ].join(" ")}
              >
                Sewa Manekin
              </button>

              {/* AUTH AREA (DESKTOP) */}
              {!session ? (
                <button
                  onClick={() => {
                    setIsRegister(false);
                    openAuthModal();
                  }}
                  className="ml-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Login
                </button>
              ) : (
                <div className="ml-2 flex items-center gap-3">
                  <p className="text-gray-700 text-sm hidden lg:block">
                    👤 {session.user.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-gray-400 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* MOBILE TOGGLER (OPEN DRAWER) */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER + OVERLAY */}
      <div
        className={[
          "md:hidden fixed inset-0 z-[60] transition-opacity duration-200",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer Panel (75% width) */}
        <div
          className={[
            "absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white shadow-xl border-l border-slate-200",
            "transform transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          {/* Header Drawer */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-base font-semibold text-slate-800">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6 text-slate-700" />
            </button>
          </div>

          {/* Scrollable content */}
          <nav className="flex max-h-[calc(100vh-56px)] flex-col gap-1 overflow-y-auto p-3">
            <button
              onClick={() => go("/")}
              className={[
                "rounded-xl px-4 py-3 text-base text-left",
                isActive("/") ? "bg-blue-50 text-blue-700" : "text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              Home
            </button>

            <button
              onClick={() => go("/les/s1")}
              className={[
                "rounded-xl px-4 py-3 text-base text-left",
                isActive("/les/s1") ? "bg-blue-50 text-blue-700" : "text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              Les S1
            </button>

            <button
              onClick={() => go("/bimbel")}
              className={[
                "rounded-xl px-4 py-3 text-base text-left",
                isActive("/bimbel") ? "bg-blue-50 text-blue-700" : "text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              Bimbel UKMPPD
            </button>

            <button
              onClick={() => go("/rental")}
              className={[
                "rounded-xl px-4 py-3 text-base text-left",
                isActive("/rental") ? "bg-blue-50 text-blue-700" : "text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              Sewa Manekin
            </button>

            <div className="mt-2 border-t border-slate-200/60 pt-2">
              {!session ? (
                <button
                  onClick={() => {
                    setIsRegister(false);
                    openAuthModal();
                    setMobileOpen(false);
                  }}
                  className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 text-left"
                >
                  Login
                </button>
              ) : (
                <>
                  <p className="px-4 py-2 text-sm text-slate-700">👤 {session.user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* AUTH MODAL (TETAP SAMA) */}
      {showAuthModal && (
        <div className="fixed inset-0 flex justify-center items-center z-[70] bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 border border-gray-200 rounded-2xl shadow-xl p-8 w-[370px] relative backdrop-blur-md transition-all">
            <button
              onClick={() => {
                closeAuthModal();
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
                />
              )}
              {isRegister && <div className="border rounded-lg px-3 py-2 w-full mb-3" />}

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
