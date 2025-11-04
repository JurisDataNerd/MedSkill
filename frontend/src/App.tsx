import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Halaman User
import LandingPage from "./pages/LandingPage";
import RentalCatalog from "./pages/RentalCatalog";
import LesS1 from "./pages/LesS1";
import BimbelPage from "./pages/BimbelUKMPPD/BimbelPage";
import TryOutSection from "./pages/BimbelUKMPPD/components/TryOutSection";
import TryoutExamPage from "./pages/TryoutExamPage";
import VerifyPage from "./pages/VerifyPage";

// Halaman Admin
import AdminDashboard from "./admin/AdminDashboard";
import ManekinManager from "./admin/ManekinManager";
import AdminBimbelManager from "./admin/AdminBimbelManager";

// Proteksi Admin
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ Navbar selalu muncul */}
      <Navbar />

      <Routes>
        {/* ✅ Halaman User */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/rental" element={<RentalCatalog />} />
        <Route path="/les/s1" element={<LesS1 />} />
        <Route path="/bimbel" element={<BimbelPage />} />
        <Route path="/bimbel/tryout" element={<TryOutSection />} />
        <Route path="/tryout/demo" element={<TryoutExamPage />} />
        <Route path="/verify/:token" element={<VerifyPage />} />

        {/* ✅ Halaman Admin (HANYA ADMIN) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manekin"
          element={
            <AdminRoute>
              <ManekinManager />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bimbel"
          element={
            <AdminRoute>
              <AdminBimbelManager />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
