import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ProductVariant } from "@/data/products";

// Definisikan tipe untuk produk agar konsisten di seluruh aplikasi
export interface Product {
  id: number | string;
  name: string;
  slug: string; // Tambahkan slug untuk URL ramah SEO
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
  variants?: ProductVariant[];
}

interface ShopContextType {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  minRating: number | null;
  setMinRating: (rating: number | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  refreshProducts: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("default");

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/catalog/products`);
      if (!response.ok) throw new Error("Gagal mengambil data produk");
      
      const result = await response.json();
      
      if (result.status === "success") {
        // Mapping data dari backend ke format yang diharapkan frontend
        const mappedProducts = result.products.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: parseFloat(p.base_price),
          image: p.primary_image || "/placeholder.jpg",
          category: p.category?.name || "Uncategorized",
          rating: 4.8, // Default rating karena backend belum menyediakan
          description: p.description || "",
          isBestseller: p.is_bestseller
        }));
        
        setProducts(mappedProducts);
        
        // Ambil kategori unik dari filters API atau dari hasil mapping
        if (result.filters && result.filters.categories) {
          setCategories(result.filters.categories.map((c: any) => c.name));
        }

        // Update max price range jika ada data dari API
        if (result.filters && result.filters.price) {
          setPriceRange([0, result.filters.price.max]);
        }
      }
    } catch (err: any) {
      console.error("Fetch products error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (minRating !== null) {
      result = result.filter((p) => p.rating >= minRating);
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (sortBy !== "default") {
      switch (sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return result;
  }, [products, searchQuery, selectedCategory, minRating, priceRange, sortBy]);

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        categories,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        minRating,
        setMinRating,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
