import { Mail, Phone, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#1E3A8A] text-white mt-20">
      {/* Wave background or decorative */}
      <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-b from-white to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        {/* Logo & intro */}
        <div>
          <h2 className="text-2xl font-bold mb-3">MedSkill</h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            Platform pembelajaran dan layanan medis modern berbasis teknologi.
            Terpercaya, efisien, dan mudah diakses kapan saja.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline hover:text-blue-200">Home</a></li>
            <li><a href="/rental" className="hover:underline hover:text-blue-200">Rental Alat Medis</a></li>
            <li><a href="#courses" className="hover:underline hover:text-blue-200">Kursus</a></li>
            <li><a href="#about" className="hover:underline hover:text-blue-200">Tentang Kami</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Kontak</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +62 812-3456-7890
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@medskill.co.id
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Ikuti Kami</h3>
          <div className="flex gap-3">
            <a href="#" className="hover:text-blue-300 transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-blue-300 transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-blue-300 transition"><Linkedin size={20} /></a>
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
