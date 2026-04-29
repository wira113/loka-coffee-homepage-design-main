// halaman utama yang menampilkan semua produk dan filter
import { useShop } from "@/context/ShopContext"; // konteks kustom untuk status toko
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
// Hook cart internal untuk menambahkan produk ke keranjang
import { useCart } from "react-use-cart";
// Gambar kedua khusus untuk Croissant Butter, dipakai saat hover di kartu produk.
import croissantButter2 from "@/assets/croissant-butter-2.png";

// fungsi pembantu untuk menampilkan angka harga dalam format rupiah
// menggunakan Intl.NumberFormat sehingga pemformatan konsisten
const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

// komponen sidebar berisi filter (kategori, harga, merek)
// catatan: kotak pencarian dihilangkan sesuai permintaan sebelumnya; pemfilteran
// dikendalikan oleh `searchQuery` global yang dapat diatur lewat input navbar.
function FilterSidebar() {
  // ambil nilai dan fungsi pembaruan dari context toko
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    minRating,
    setMinRating,
    priceRange,
    setPriceRange,
  } = useShop();


  // render elemen-elemen filter pada sidebar
  return (
    <div className="space-y-8">
      {/* bagian kategori - radio button untuk memilih kategori produk */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3">Kategori</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === null}
              onChange={() => setSelectedCategory(null)}
              className="accent-primary"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Semua</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
                className="accent-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Rating - untuk belajar filter produk berdasarkan rating */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3">Rating Minimal</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="minRating"
              checked={minRating === null}
              onChange={() => setMinRating(null)}
              className="accent-primary"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Semua</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="minRating"
              checked={minRating === 4.5}
              onChange={() => setMinRating(4.5)}
              className="accent-primary"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">4.5 ke atas</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="minRating"
              checked={minRating === 4}
              onChange={() => setMinRating(4)}
              className="accent-primary"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">4 ke atas</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="minRating"
              checked={minRating === 4.8}
              onChange={() => setMinRating(4.8)}
              className="accent-primary"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">4.8 ke atas</span>
          </label>
        </div>
      </div>

      {/* Rentang Harga - slider interaktif */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3">Rentang Harga</h3>
        <Slider
          min={0}
          max={50000}
          step={1000}
          onValueChange={([val]) => setPriceRange([0, val])}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );
}

// komponen halaman utama menampilkan produk dan sidebar filter
export default function Products() {
  // ambil data dan fungsi setter dari konteks toko
  const { filteredProducts, sortBy, setSortBy, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, minRating, setMinRating, isLoading, error } = useShop();
  // status untuk membuka/menutup drawer sidebar di mobile
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Membaca query parameter saat halaman pertama dimuat
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  // Update URL jika selectedCategory berubah via UI
  useEffect(() => {
    const currentParam = searchParams.get("category");
    if (selectedCategory) {
      if (currentParam !== selectedCategory) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("category", selectedCategory);
        setSearchParams(newParams, { replace: true });
      }
    } else if (currentParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      setSearchParams(newParams, { replace: true });
    }
  }, [selectedCategory, searchParams, setSearchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-container py-20 text-center">
          <p className="text-destructive font-medium">Terjadi kesalahan: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Coba Lagi
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="section-container py-8 md:py-12">
        {/* Header halaman */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">All Products</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? "Memuat produk..." : `Showing ${filteredProducts.length} products`}
            </p>
          </div>
          {/* ... existing sort controls ... */}
          <div className="flex items-center gap-3">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <h2 className="font-display text-lg font-semibold mb-6">Filters</h2>
                <FilterSidebar />
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Harga: Rendah ke Tinggi</SelectItem>
                <SelectItem value="price-desc">Harga: Tinggi ke Rendah</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters chips ... */}
        {(searchQuery || selectedCategory || minRating !== null) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-muted-foreground">Filter aktif:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                &quot;{searchQuery}&quot;
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
              </span>
            )}
            {minRating !== null && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                Rating ≥ {minRating}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setMinRating(null)} />
              </span>
            )}
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-lg border border-border p-6">
              <FilterSidebar />
            </div>
          </aside>

          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.isBestseller && (
                        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
                          Bestseller
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.category}</p>
                      <h3 className="font-display font-semibold text-foreground leading-tight h-10 line-clamp-2">{product.name}</h3>

                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-body font-bold text-foreground">{formatPrice(product.price)}</span>
                        <span className="text-[10px] text-green-600 font-medium">Tersedia</span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          className="w-full text-center text-sm font-medium bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Detail & Pilih Varian
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Tidak ada produk ditemukan.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
