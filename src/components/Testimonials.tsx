// Komponen untuk menampilkan testimoni pelanggan Loka Coffee.
// Data testimoni diambil dari `data/products.ts` (array `testimonials`).
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/products";

const Testimonials = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      {/* Judul section testimoni */}
      <div className="mb-10 text-center md:mb-14">
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Testimoni</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Apa Kata Mereka</h2>
      </div>

      {/* Grid kartu testimoni, 3 kolom di layar besar */}
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-6 md:p-8">
            {/* Ikon kutip sebagai elemen dekoratif */}
            <Quote size={24} className="text-primary/30" />
            {/* Isi testimoni */}
            <p className="mt-4 font-body text-sm leading-relaxed text-foreground">"{t.text}"</p>
            {/* Deretan bintang rating berdasarkan angka rating */}
            <div className="mt-4 flex items-center gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={14} className="fill-primary text-primary" />
              ))}
            </div>
            {/* Nama dan peran/pekerjaan pemberi testimoni */}
            <div className="mt-4 border-t border-border pt-4">
              <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
              <p className="font-body text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
