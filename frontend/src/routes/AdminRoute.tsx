import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    const check = async () => {
      const { data: sess } = await supabase.auth.getSession();
      const session = sess.session;

      if (!session) {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
          if (newSession) {
            runRoleCheck(newSession.user.id);
          } else {
            setStatus("denied");
          }
        });
        return () => listener?.subscription.unsubscribe();
      }

      runRoleCheck(session.user.id);
    };

    const runRoleCheck = async (userId: string) => {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !data || data.role !== "admin") {
        setStatus("denied");
        return;
      }

      setStatus("ok");
    };

    check();
  }, []);

  if (status === "checking") {
    return <div className="p-8 text-gray-500 text-center">Memeriksa akses admin...</div>;
  }

  if (status === "denied") {
    return <Navigate to="/" replace />;
  }

  return children;
}
