import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    const check = async () => {
      const { data: sess } = await supabase.auth.getSession();
      console.log("SESSION DATA:", sess);

      const session = sess.session;
      if (!session) {
        console.log("⛔ Tidak ada session (belum login)");
        return setStatus("denied");
      }

      // Coba ambil role dari tabel users
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      console.log("ROLE QUERY RESULT:", data);
      console.log("ROLE QUERY ERROR:", error);

      if (error) {
        console.log("⛔ QUERY ERROR, kemungkinan RLS block!");
        return setStatus("denied");
      }

      if (!data || data.role !== "admin") {
        console.log("⛔ BUKAN ADMIN! role =", data?.role);
        return setStatus("denied");
      }

      console.log("✅ ADMIN TERDETEKSI!");
      setStatus("ok");
    };
    check();
  }, []);

  if (status === "checking") return <div>Memeriksa akses...</div>;
  if (status === "denied") return <Navigate to="/" replace />;

  return children;
}
