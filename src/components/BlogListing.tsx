// Halaman daftar blog (Blog Listing) yang menampilkan semua artikel blog Loka Coffee.
// Termasuk pencarian, filter kategori, dan kartu-kartu artikel.
import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight, Tag, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBlog } from "@/context/BlogContext";
import { Input } from "@/components/ui/input";

const BlogListing = () => {
  const {
    filteredBlogs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    blogCategories,
  } = useBlog();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header: judul halaman blog dan deskripsi singkat */}
      <section className="bg-primary/10 py-16">
        <div className="section-container text-center">
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Blog & Updates
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-muted-foreground">
            Tips, berita, dan cerita seputar dunia kopi dari Loka Coffee.
          </p>
        </div>
      </section>

      {/* Filters: kotak pencarian dan filter kategori */}
      <section className="section-container py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search: input untuk mencari artikel berdasarkan judul / excerpt */}
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category pills: tombol kategori (Tips, News, dll.) */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-1.5 font-body text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Semua
            </button>
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                className={`rounded-full px-4 py-1.5 font-body text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid: daftar semua artikel dalam bentuk kartu */}
      <section className="section-container pb-16">
        {filteredBlogs.length === 0 ? (
          <p className="py-12 text-center font-body text-muted-foreground">
            Tidak ada artikel yang ditemukan.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Gambar header artikel dari API backend */}
                <img
                  src={`${import.meta.env.VITE_API_URL}${blog.image}`}
                  alt={blog.title}
                  className="aspect-video w-full object-cover"
                  onError={(e) => {
                    // Fallback jika gambar dari API tidak berhasil dimuat
                    const img = e.target as HTMLImageElement;
                    img.src = "https://placehold.co/600x400?text=Loka+Coffee";
                  }}
                />

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {blog.date}
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                    {blog.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 font-body text-sm text-muted-foreground">
                    {blog.excerpt}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:underline">
                    Baca Selengkapnya <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default BlogListing;
