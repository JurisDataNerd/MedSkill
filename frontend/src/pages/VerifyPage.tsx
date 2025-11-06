import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = params.get("token");
    const type = params.get("type");

    if (token && type === "signup") {
      setStatus("success");
      setTimeout(() => navigate("/"), 3000);
    } else {
      setStatus("error");
    }
  }, [params, navigate]);

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
            <p className="text-gray-600">
              Akun Anda telah diverifikasi. Anda akan dialihkan ke halaman utama...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-3">
              ❌ Verifikasi Gagal
            </h2>
            <p className="text-gray-600">Token tidak valid atau sudah kadaluarsa.</p>
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
