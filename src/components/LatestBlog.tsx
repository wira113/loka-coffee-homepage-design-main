// Komponen untuk menampilkan daftar singkat artikel blog terbaru.
// Data blog diambil dari API backend via BlogContext dan hanya 3 item teratas yang ditampilkan.
import { ArrowRight } from "lucide-react";
import { useBlog } from "@/context/BlogContext";
import { Link } from "react-router-dom";

const LatestBlog = () => {
  const { blogs } = useBlog();
  const latestBlogs = blogs.slice(0, 3);

  return (
    <section className="section-padding bg-card">
      <div className="section-container">
        {/* Judul dan subjudul bagian blog */}
        <div className="mb-10 text-center md:mb-14">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">Blog</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Latest Updates</h2>
        </div>

        {/* Grid kartu blog, responsif menjadi 3 kolom di layar besar */}
        <div className="grid gap-6 md:grid-cols-3">
          {latestBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background"
            >
              {/* Gambar blog, diberi efek zoom saat hover */}
              <div className="overflow-hidden aspect-[16/10] w-full bg-muted">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                {/* Kategori dan tanggal artikel */}
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase text-primary">
                    {blog.category}
                  </span>
                  <span className="font-body text-[10px] text-muted-foreground">{blog.date}</span>
                </div>
                {/* Judul blog */}
                <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foreground md:text-lg">
                  {blog.title}
                </h3>
                {/* Ringkasan singkat blog, dipotong menjadi 2 baris (line-clamp-2) */}
                <div 
                  className="mt-2 font-body text-xs leading-relaxed text-muted-foreground line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: blog.excerpt || blog.content?.substring(0, 100) + '...' }}
                />
                {/* Tautan ajakan membaca selengkapnya */}
                <div className="mt-auto pt-4">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center gap-1 font-body text-xs font-semibold text-primary transition-transform hover:translate-x-1"
                  >
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
