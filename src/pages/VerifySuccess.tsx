export default function VerifySuccess() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">
        ✅ Email Berhasil Diverifikasi!
      </h1>
      <p className="text-gray-600 mb-4">
        Silakan kembali ke aplikasi dan login dengan akun kamu.
      </p>
      <a
        href="/"
        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-lg"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
