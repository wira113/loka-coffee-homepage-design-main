import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { Blog } from "@/data/products";

interface BlogContextType {
  blogs: Blog[];
  filteredBlogs: Blog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  blogCategories: string[];
  isLoading: boolean;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live data dari API Backend Loka Coffee
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog`);
        const json = await response.json();
        
        if (json.status === "success" && json.data && json.data.data) {
          // Transformasi data agar sesuai dengan format frontend
          const fetchedBlogs: Blog[] = json.data.data.map((item: any) => {
            // Karena ini untuk UI yang butuh gambar, jika thumbnail dari backend null,
            // kita pakai placeholder default.
            const fallbackImage = "https://via.placeholder.com/600x400?text=Loka+Coffee";
            
            let imageUrl = item.thumbnail_url;
            if (imageUrl) {
              if (!imageUrl.startsWith('http')) {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                imageUrl = imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
              }
            } else {
              imageUrl = fallbackImage;
            }
            
            return {
              id: item.id,
              title: item.title,
              category: item.tags && item.tags.length > 0 ? item.tags[0].name : "Berita",
              author: item.author ? item.author.name : "Admin",
              date: new Date(item.published_at).toLocaleDateString("id-ID", {
                year: 'numeric', month: 'short', day: 'numeric'
              }),
              image: imageUrl,
              excerpt: item.excerpt,
              content: item.content
            };
          });
          setBlogs(fetchedBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const blogCategories = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.category))),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((b) => b.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory, blogs]);

  return (
    <BlogContext.Provider
      value={{
        blogs,
        filteredBlogs,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        blogCategories,
        isLoading,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
