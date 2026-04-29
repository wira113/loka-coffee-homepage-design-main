// Hero section pada halaman utama.
// Bagian ini berfungsi sebagai pengenalan singkat (headline) dan ajakan bertindak (CTA) ke halaman produk / tentang kami.
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-coffee.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-background">
    <div className="section-container grid items-center gap-8 py-16 md:grid-cols-2 md:gap-12 md:py-24 lg:py-32">
      {/* Kolom kiri: teks headline dan tombol CTA */}
      <div className="order-2 md:order-1">
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
          Welcome to Loka Coffee
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
          Nikmati Kopi & Sajian Istimewa Setiap Hari
        </h1>
        <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-muted-foreground md:text-base">
          Dari secangkir espresso yang bold hingga croissant renyah yang lembut — setiap momen jadi lebih spesial
          bersama Loka Coffee.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {/* Tombol menuju halaman produk */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Beli Sekarang <ArrowRight size={16} />
          </Link>
          {/* Tombol scroll ke bagian 'about' di halaman yang sama */}
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-body text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Tentang Kami
          </a>
        </div>
      </div>

      {/* Kolom kanan: gambar hero */}
      <div className="order-1 md:order-2">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={heroImage}
            alt="Loka Coffee - Kopi dan croissant"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
