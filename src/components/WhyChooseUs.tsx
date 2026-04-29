// Section "Kenapa memilih kami" yang menjelaskan keunggulan Loka Coffee.
// Dihubungkan dengan tombol "Tentang Kami" pada Hero melalui id `about`.
import { Check } from "lucide-react";
import whyChooseUsImage from "@/assets/Why-Choose-Us.png";

// Daftar alasan yang akan dirender sebagai bullet list.
const reasons = [
  "Biji kopi single-origin dari Toraja, Gayo, dan Flores",
  "Di-roast segar setiap minggu untuk menjaga aroma",
  "Barista berpengalaman yang passionate",
  "Harga bersahabat tanpa mengorbankan kualitas",
];

const WhyChooseUs = () => (
  <section id="about" className="section-padding bg-card">
    <div className="section-container grid items-center gap-10 md:grid-cols-2 md:gap-16">
      {/* Placeholder gambar / ilustrasi di sisi kiri */}
      <img
      src={whyChooseUsImage}
        alt="Why Choose Us"
        className="aspect-[4/3] w-full rounded-lg bg-secondary/30"
      />

      <div>
        {/* Judul dan deskripsi utama bagian ini */}
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Kenapa Kami</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          Kopi Berkualitas untuk Semua Kalangan
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
          Dari anak muda yang butuh energi ekstra hingga orang tua yang menikmati waktu santai — Loka Coffee hadir
          untuk semua pencinta kopi sejati. Kami percaya kopi yang baik bisa dinikmati siapa saja.
        </p>
        {/* List poin-poin keunggulan, masing-masing dengan ikon centang */}
        <ul className="mt-6 space-y-3">
          {reasons.map((r) => (
            <li key={r} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Check size={12} className="text-primary" />
              </span>
              <span className="font-body text-sm text-foreground">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
