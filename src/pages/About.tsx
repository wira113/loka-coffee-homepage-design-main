// Halaman "Tentang Kami" (About) untuk Loka Coffee.
// Menjelaskan cerita brand, nilai-nilai, dan ajakan berkunjung.
import { Coffee, Heart, Users, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Import gambar statis halaman about.
// Pastikan file `halaman-about.png` disimpan di folder `src/assets`.
import aboutImage from "@/assets/halaman-about.png";

const values = [
  {
    icon: Coffee,
    title: "Kopi Berkualitas",
    description:
      "Kami hanya menggunakan biji kopi pilihan dari petani lokal terbaik di Indonesia, di-roast dengan penuh perhatian.",
  },
  {
    icon: Heart,
    title: "Dibuat dengan Cinta",
    description:
      "Setiap cangkir kopi kami disiapkan oleh barista berpengalaman yang mencintai seni meracik kopi.",
  },
  {
    icon: Users,
    title: "Komunitas",
    description:
      "Loka Coffee adalah tempat berkumpul, berbagi cerita, dan membangun koneksi yang bermakna.",
  },
  {
    icon: MapPin,
    title: "Lokal & Berkelanjutan",
    description:
      "Kami berkomitmen mendukung petani lokal dan menerapkan praktik bisnis yang ramah lingkungan.",
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Header: judul besar dan subjudul singkat */}
    <section className="bg-primary/10 py-20">
      <div className="section-container text-center">
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
          Tentang Loka Coffee
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground">
          Lebih dari sekadar kedai kopi — kami adalah ruang untuk menikmati
          momen, merayakan rasa, dan membangun komunitas.
        </p>
      </div>
    </section>

    {/* Story: bagian cerita brand + gambar ilustrasi */}
    <section className="section-container py-16">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
        {/* Kolom kiri: gambar halaman about.
            Gambar diambil dari file `halaman-about.png` yang baru kita import di atas. */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src={aboutImage}
            alt="Suasana kedai Loka Coffee"
            className="aspect-square w-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Cerita Kami
          </h2>
          <p className="mt-4 font-body leading-relaxed text-muted-foreground">
            Loka Coffee lahir dari kecintaan terhadap kopi Indonesia. Bermula
            dari sebuah gerobak kecil di sudut kota Jakarta pada tahun 2020,
            kami terus tumbuh berkat dukungan para pecinta kopi yang percaya
            bahwa kopi lokal bisa bersaing dengan brand internasional.
          </p>
          <p className="mt-3 font-body leading-relaxed text-muted-foreground">
            Nama "Loka" berasal dari bahasa Sansekerta yang berarti "dunia".
            Kami percaya setiap cangkir kopi membuka jendela ke dunia baru —
            dunia rasa, budaya, dan koneksi manusia.
          </p>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="bg-muted/50 py-16">
      <div className="section-container">
        <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">
          Nilai-Nilai Kami
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <v.icon size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                {v.title}
              </h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-container py-16 text-center">
      <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
        Yuk, Mampir ke Loka Coffee!
      </h2>
      <p className="mx-auto mt-3 max-w-lg font-body text-muted-foreground">
        Datang dan rasakan sendiri pengalaman kopi terbaik. Kami tunggu
        kedatanganmu!
      </p>
      <a
        href="/products"
        className="mt-6 inline-block rounded-full bg-primary px-8 py-3 font-body text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Lihat Menu Kami
      </a>
    </section>

    <Footer />
  </div>
);

export default About;
