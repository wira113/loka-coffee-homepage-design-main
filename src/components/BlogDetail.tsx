// Halaman detail blog: menampilkan isi lengkap satu artikel.
// Menggunakan data dari `blogs` di `data/products.ts`.
import { useParams, Link } from "react-router-dom";
import { CalendarDays, User, Tag, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBlog } from "@/context/BlogContext";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs, isLoading } = useBlog();
  
  const blog = blogs.find((b) => Number(b.id) === Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-container flex items-center justify-center py-32 text-center text-muted-foreground">
          Memuat artikel...
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-container flex flex-col items-center justify-center py-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Artikel Tidak Ditemukan
          </h1>
          <Link to="/blog" className="mt-4 text-primary hover:underline">
            ← Kembali ke Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogs.filter((b) => Number(b.id) !== blog.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="section-container py-12">
        {/* Breadcrumb */}
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} /> Kembali ke Blog
        </Link>

        {/* Blog Card Container - menggunakan styling konsisten dengan BlogListing */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Hero image dari API backend */}
          <img
            src={`${import.meta.env.VITE_API_URL}${blog.image}`}
            alt={blog.title}
            className="aspect-video w-full object-cover"
            onError={(e) => {
              // Fallback jika gambar dari API tidak berhasil dimuat
              const img = e.target as HTMLImageElement;
              img.src = "https://via.placeholder.com/600x400?text=Loka+Coffee";
            }}
          />

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Meta */}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Tag size={14} />
                {blog.category}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={14} />
                {blog.date}
              </span>
              <span className="flex items-center gap-1">
                <User size={14} />
                {blog.author}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              {blog.title}
            </h1>

            {/* Article Content */}
            <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-muted-foreground">
              <p>{blog.excerpt}</p>
              <p>{blog.content}</p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts: daftar artikel lain sebagai rekomendasi */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="section-container">
            <h2 className="mb-8 font-display text-2xl font-bold text-foreground">
              Artikel Lainnya
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Gambar dari API backend */}
                  <img
                    src={`${import.meta.env.VITE_API_URL}${post.image}`}
                    alt={post.title}
                    className="aspect-video w-full object-cover"
                    onError={(e) => {
                      // Fallback jika gambar dari API tidak berhasil dimuat
                      const img = e.target as HTMLImageElement;
                      img.src = "https://via.placeholder.com/600x400?text=Loka+Coffee";
                    }}
                  />
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-foreground group-hover:text-primary">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetail;
