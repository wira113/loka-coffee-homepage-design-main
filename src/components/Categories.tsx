// Komponen untuk menampilkan kategori utama menu (Coffee, Non-Coffee, Makanan Ringan).
// Menggunakan data kategori dari API backend via ShopContext.
import { ArrowRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Link } from "react-router-dom";

// Mapping kategori ke deskripsi singkat (opsional fallback)
const categoryMeta: Record<string, { desc: string }> = {
  Coffee: { desc: "Espresso, Latte, Cappuccino & more" },
  "Non-Coffee": { desc: "Matcha, Smoothie, Chocolate" },
  "Makanan Ringan": { desc: "Croissant, Cake, Banana Bread" },
};

const Categories = () => {
  const { categories, products } = useShop();

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        {/* Judul section kategori */}
        <div className="mb-10 text-center md:mb-14">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Kategori</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Jelajahi Menu Kami</h2>
        </div>

        {/* Grid kartu kategori, 3 kolom di layar besar */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {categories.slice(0, 3).map((cat) => {
            // Cari produk pertama di kategori ini untuk mengambil gambarnya
            const firstProduct = products.find(p => p.category === cat);
            const imageUrl = firstProduct?.image || "https://via.placeholder.com/600x400?text=Kategori";
            const desc = categoryMeta[cat]?.desc || "Jelajahi pilihan menu terbaik kami";

            return (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="group relative overflow-hidden rounded-lg block"
              >
                {/* Gambar setiap kategori */}
                <div className="overflow-hidden aspect-[3/2] w-full bg-muted">
                  <img
                    src={imageUrl}
                    alt={cat}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Overlay gradient berisi judul, deskripsi, dan teks link */}
                <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent p-5 md:p-6">
                  <h3 className="font-display text-lg font-bold text-background md:text-xl">{cat}</h3>
                  <p className="mt-1 font-body text-xs text-background/90">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 font-body text-xs font-semibold text-background transition-transform group-hover:translate-x-1">
                    Lihat Semua <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
