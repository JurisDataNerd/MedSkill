import type { ReactNode } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navLink =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100";
  const active = ({ isActive }: any) =>
    `${navLink} ${isActive ? "bg-gray-100 font-semibold text-[#1E3A8A]" : ""}`;

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
        <div className="px-6 py-5 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-xl" />
            <h1 className="text-xl font-bold text-[#1E3A8A]">MedSkill Admin</h1>
          </div>
        </div>

        <div className="px-4 py-4 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">HOME</p>
            <NavLink to="/admin" className={active}>
                <span>Dashboard</span>
            </NavLink>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">RENTAL</p>
            <NavLink to="/admin/manekin" className={active}>
              <span>Manekin Manager</span>
            </NavLink>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">AUTH</p>
            <button onClick={logout} className={navLink} title="Logout">
                <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64">
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">
              🔔
            </button>
            <div className="w-9 h-9 rounded-full bg-[#E0EAFF] flex items-center justify-center">
              👤
            </div>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
