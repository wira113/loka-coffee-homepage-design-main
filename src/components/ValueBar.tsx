// Komponen baris nilai (value bar) yang menampilkan keunggulan utama Loka Coffee.
// Biasanya diletakkan setelah hero sebagai penjelasan singkat kenapa brand ini menarik.
import { Truck, ShieldCheck, Coffee, Heart } from "lucide-react";

// Data statis berisi ikon, judul, dan deskripsi singkat tiap nilai.
const values = [
  { icon: Coffee, title: "Biji Kopi Premium", desc: "Dipilih langsung dari petani terbaik Nusantara" },
  { icon: Truck, title: "Pengiriman Cepat", desc: "Sampai di depan pintu dalam 1-2 hari" },
  { icon: ShieldCheck, title: "Kualitas Terjamin", desc: "Fresh roasted setiap minggu" },
  { icon: Heart, title: "Dibuat dengan Cinta", desc: "Setiap cangkir diracik penuh perhatian" },
];

const ValueBar = () => (
  <section className="border-b border-border bg-card">
    <div className="section-container grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:gap-8 md:py-14">
      {values.map((v) => (
        <div key={v.title} className="flex flex-col items-center text-center">
          {/* Lingkaran ikon di atas teks */}
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <v.icon size={22} className="text-primary" />
          </div>
          {/* Judul dan deskripsi singkat poin nilai */}
          <h3 className="font-display text-sm font-semibold text-foreground">{v.title}</h3>
          <p className="mt-1 font-body text-xs text-muted-foreground">{v.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ValueBar;
