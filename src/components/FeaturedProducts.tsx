// Komponen untuk menampilkan produk-produk unggulan (featured) di halaman utama.
// Data produk diambil dari `data/products.ts` dan hanya item dengan `isFeatured = true` yang ditampilkan.
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { products as staticProducts } from "@/data/products";
import { useCart } from "react-use-cart";
import { toast } from "sonner";
import { useShop } from "@/context/ShopContext";

const FeaturedProducts = () => {
  const { products, isLoading } = useShop();
  const { addItem } = useCart();

  // Ambil produk bestseller sebagai unggulan jika data tersedia, 
  // jika belum memuat, tampilkan kosong (atau skeleton)
  const featured = products.filter((p) => p.isBestseller).slice(0, 4);

  if (isLoading && products.length === 0) {
    return (
      <section id="products" className="section-padding bg-background">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section-padding bg-background">
      <div className="section-container">
        {/* Judul dan subjudul section produk unggulan */}
        <div className="mb-10 text-center md:mb-14">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Pilihan Terbaik</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Our Favorites</h2>
        </div>

        {/* Grid kartu produk unggulan: 2 kolom di mobile, 4 kolom di layar besar */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featured.map((p, i) => (
            <Link
              to={`/product/${p.slug}`}
              key={p.id}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-[var(--card-shadow)] transition-shadow duration-300 hover:shadow-[var(--card-shadow-hover)] block"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-square overflow-hidden border-b">
                <img
                  src={p.image}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3 md:p-4">
                {/* Kategori kecil di atas judul */}
                <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{p.category}</p>
                {/* Nama produk */}
                <h3 className="mt-1 font-display text-sm font-semibold text-foreground md:text-base">{p.name}</h3>
                {/* Rating dengan ikon bintang */}
                <div className="mt-1 flex items-center gap-1">
                  <Star size={12} className="fill-primary text-primary" />
                  <span className="font-body text-xs text-muted-foreground">{p.rating}</span>
                </div>
                {/* Harga dan tombol keranjang */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-body text-sm font-bold text-foreground">
                    Rp {p.price.toLocaleString("id-ID")}
                  </span>
                  <button
                    aria-label="Add to cart"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                    onClick={(e) => {
                      // Cegah klik tombol ini men-trigger navigasi ke halaman detail
                      e.preventDefault();
                      e.stopPropagation();
                      addItem({
                        id: String(p.id),
                        name: p.name,
                        price: p.price,
                        image: p.image,
                      }, 1);
                      toast.success(`${p.name} ditambahkan ke keranjang`);
                    }}
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
