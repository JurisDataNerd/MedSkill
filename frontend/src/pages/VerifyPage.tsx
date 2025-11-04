import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "info">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const res = await fetch(`${baseUrl}/api/email/verify/${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Akun berhasil diverifikasi!");
          setTimeout(() => navigate("/"), 3000);
        } else if (
          data.message?.toLowerCase().includes("sudah diverifikasi") ||
          data.message?.toLowerCase().includes("sudah digunakan")
        ) {
          setStatus("info");
          setMessage("Akun berhasil diverifikasi! Silahkan login kembali dengan email dan password Anda.");
          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Token tidak valid atau sudah digunakan.");
        }
      } catch {
        setStatus("error");
        setMessage("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md">
        {status === "loading" && (
          <>
            <h2 className="text-xl font-semibold text-blue-700 mb-3">
              Memverifikasi akun...
            </h2>
            <p className="text-gray-600 text-sm">Mohon tunggu sebentar.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              ✅ Verifikasi Berhasil!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-3">
              Anda akan dialihkan ke halaman utama...
            </p>
          </>
        )}

        {status === "info" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              ✅ Verifikasi Berhasil!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-3">
              Mengarahkan Anda ke halaman utama...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-3">
              ❌ Verifikasi Gagal
            </h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Kembali ke Beranda
            </button>
          </>
        )}
      </div>
    </div>
  );
}
