import { Mail, Phone, Instagram} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-[#1E3A8A] text-white mt-20">
      {/* Wave background or decorative */}
      <div className="absolute inset-x-0 -top-6 h-6 bg-linear-to-b from-white to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        {/* Logo & intro */}
        <div>
          <h2 className="text-2xl font-bold mb-3">MedSkill</h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            Solusi Lengkap Belajar Kedokteran.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline hover:text-blue-200">Home</Link></li>
            <li><Link to="/les/s1" className="hover:underline hover:text-blue-200">Les S1</Link></li>
            <li><Link to="/bimbel" className="hover:underline hover:text-blue-200">Bimbel UKMPDD</Link></li>
            <li><Link to="/rental" className="hover:underline hover:text-blue-200">Sewa Manekin</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Kontak</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +62 851-5539-5070
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> officemedskill.idn@gmail.com
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Ikuti Kami</h3>
          <div className="flex gap-3">
            <a href="https://www.tiktok.com/@medskill.idn" className="hover:text-blue-300 transition"><img src="/tiktok.svg" alt="" width={20}  /></a>
            <a href="https://www.instagram.com/medskill.idn/" className="hover:text-blue-300 transition"><Instagram size={20} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10">
        <p className="text-center text-xs text-gray-300 py-4">
          © {new Date().getFullYear()} MedSkill. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
