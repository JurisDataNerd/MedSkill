import { useEffect, useState, Fragment } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthModal } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";

export default function Navbar() {
  const { showAuthModal, openAuthModal, closeAuthModal } = useAuthModal();
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<{ full_name?: string; university?: string }>({});
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ====== AMBIL SESSION DAN PROFIL ======
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user) fetchUserProfile(data.session.user.id);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUserProfile(session.user.id);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  // ====== FETCH USER PROFILE ======
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("full_name, university")
      .eq("id", userId)
      .single();
    if (!error && data) setUserProfile(data);
  };

  // ====== SCROLL EFFECT ======
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ====== LOCK BODY SCROLL SAAT MOBILE MENU ======
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  // ====== HANDLE LOGIN & REGISTER ======
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError("Konfirmasi password tidak cocok");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/email/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, full_name: fullName, university }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Gagal melakukan registrasi.");

        setSuccess("Registrasi berhasil! Silakan cek email untuk verifikasi akun.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          fetchUserProfile(data.session.user.id);
          closeAuthModal();
          navigate("/");
        }
      }
    } catch (err: any) {
      console.error("AUTH ERROR:", err);
      setError(err.message || "Terjadi kesalahan saat memproses");
    } finally {
      setLoading(false);
    }
  };

  // ====== HANDLE LOGOUT ======
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserProfile({});
    navigate("/");
    setMobileOpen(false);
  };

  // ====== UTILITAS NAVIGASI ======
  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // =====================================================
  // 🧩 RENDER COMPONENT
  // =====================================================
  return (
    <>
      {/* NAVBAR DESKTOP */}
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out
          bg-white/70 backdrop-blur-md border-b border-white/20 ${
            scrolled ? "shadow-sm" : ""
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}
            <div onClick={() => go("/")} className="flex items-center gap-2 cursor-pointer">
              <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400" />
              <span className="text-lg font-semibold tracking-tight text-slate-800">
                MedSkill
              </span>
            </div>

            {/* DESKTOP MENU */}
            <nav className="hidden md:flex items-center gap-2">
              {[
                { path: "/", label: "Home" },
                { path: "/les/s1", label: "Les S1" },
                { path: "/bimbel", label: "Bimbel UKMPPD" },
                { path: "/rental", label: "Sewa Manekin" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "text-blue-700 underline underline-offset-8 decoration-2"
                      : "text-slate-700 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {!session ? (
                <button
                  onClick={() => {
                    setIsRegister(false);
                    openAuthModal();
                  }}
                  className="ml-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Login
                </button>
              ) : (
                // ================= NEW GOOGLE-LIKE ACCOUNT MENU =================
                <Menu as="div" className="relative ml-3">
                  <Menu.Button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-200">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        userProfile.full_name || session.user.email
                      )}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-800 hidden lg:block">
                      {userProfile.full_name || session.user.email}
                    </span>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-100 divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {userProfile.full_name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? "bg-gray-50" : ""
                              } flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                            >
                              <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-500" />
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                // ================= END GOOGLE-LIKE ACCOUNT MENU =================
              )}
            </nav>

            {/* MOBILE TOGGLER */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-white/60"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1E3A8A]">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-3 mt-2">
              {[
                { path: "/", label: "Home" },
                { path: "/les/s1", label: "Les S1" },
                { path: "/bimbel", label: "Bimbel UKMPPD" },
                { path: "/rental", label: "Sewa Manekin" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  className={`text-left px-2 py-2 rounded-lg text-base font-medium transition ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto border-t pt-4">
              {!session ? (
                <button
                  onClick={() => {
                    setIsRegister(false);
                    openAuthModal();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-gray-400 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 flex justify-center items-center z-[70] bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 border border-gray-200 rounded-2xl shadow-xl p-8 w-[370px] relative">
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
              {isRegister ? "Register Akun" : "Login Akun"}
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
              {isRegister && (
                <>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="border rounded-lg px-3 py-2 w-full mb-3"
                  />
                  <input
                    type="text"
                    placeholder="Asal Universitas"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                    className="border rounded-lg px-3 py-2 w-full mb-3"
                  />
                </>
              )}

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
