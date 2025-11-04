import { Mail, Phone, Facebook, Instagram} from "lucide-react";

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
            Platform pembelajaran dan layanan medis modern berbasis teknologi.
            Terpercaya, efisien, dan mudah diakses kapan saja.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline hover:text-blue-200">Home</a></li>
            <li><a href="/les/s1" className="hover:underline hover:text-blue-200">Les S1</a></li>
            <li><a href="/bimbel" className="hover:underline hover:text-blue-200">Bimbel UKMPDD</a></li>
            <li><a href="/rental" className="hover:underline hover:text-blue-200">Sewa Manekin</a></li>
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
            <a href="https://www.tiktok.com/@medskill.idn" className="hover:text-blue-300 transition"><Facebook size={20} /></a>
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
