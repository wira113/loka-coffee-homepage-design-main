import { Toaster } from "@/components/ui/toaster"; // Komponen toast untuk menampilkan notifikasi sederhana.
import { Toaster as Sonner } from "@/components/ui/sonner"; // Komponen toast lain (Sonner) untuk variasi gaya notifikasi.
import { TooltipProvider } from "@/components/ui/tooltip"; // Provider untuk fitur tooltip di seluruh aplikasi.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query untuk pengambilan dan caching data.
import { BrowserRouter, Routes, Route } from "react-router-dom"; // React Router untuk navigasi antar halaman.
import { CartProvider } from "react-use-cart";
import { ShopProvider } from "@/context/ShopContext"; // Context khusus toko (keranjang, produk, dsb).
import { BlogProvider } from "@/context/BlogContext"; // Context khusus blog (kategori, pencarian, dsb).
import { AuthProvider } from "@/context/AuthContext"; // Context khusus autentikasi.
import { ProtectedRoute } from "@/components/ProtectedRoute"; // Component untuk melindungi route yang memerlukan login.
import Index from "./pages/Index"; // Halaman beranda.
import Products from "./pages/Products"; // Halaman daftar produk.
import ProductDetail from "./pages/ProductDetail"; // Halaman detail satu produk.
import Cart from "./pages/Cart"; // Halaman keranjang belanja.
import NotFound from "./pages/NotFound"; // Halaman jika URL tidak ditemukan (404).
import BlogListing from "./components/BlogListing";
import BlogDetail from "./components/BlogDetail";
import About from "./pages/About";
import Booking from "./pages/CustomEvent";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Membuat instance QueryClient untuk mengatur semua proses fetch data via React Query.
const queryClient = new QueryClient();

// Komponen utama aplikasi.
// Semua provider dibungkus di sini supaya bisa dipakai oleh komponen anak di dalamnya.
const App = () => (
  // Provider React Query: agar seluruh komponen di bawahnya bisa menggunakan hook React Query.
  <QueryClientProvider client={queryClient}>
    {/* Provider Tooltip: mengaktifkan sistem tooltip di seluruh aplikasi */}
    <TooltipProvider>
      {/* Dua jenis komponen toast/notifikasi yang bisa dipanggil dari mana saja */}
      <Toaster />
      <Sonner />
      {/* Provider context khusus untuk fitur toko (misalnya keranjang belanja dan data produk) */}
      <CartProvider>
        <ShopProvider>
          {/* BrowserRouter: membungkus seluruh bagian yang membutuhkan routing / URL */}
          <BlogProvider>
            <AuthProvider>
              <BrowserRouter>
              {/* Routes: daftar semua rute/halaman yang dimiliki aplikasi */}
              <Routes>
                {/* Halaman utama / beranda */}
                <Route path="/" element={<Index />} />
                {/* Halaman daftar semua produk */}
                <Route path="/products" element={<Products />} />
                {/* Halaman detail produk berdasarkan parameter slug di URL */}
                <Route path="/product/:slug" element={<ProductDetail />} />
                {/* Halaman keranjang belanja */}
                <Route path="/cart" element={<Cart />} />
                {/* Halaman blog listing dan detail */}
                <Route path="/blog" element={<BlogListing />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                {/* Halaman About kami */}
                <Route path="/about" element={<About />} />
                {/* Halaman terpisah untuk Custom Event & Workshop Booking */}
                <Route path="/booking" element={<Booking />} />
                {/* Halaman Checkout */}
                <Route path="/checkout" element={<Checkout />} />
                {/* Halaman Login & Register */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Halaman Profile - Hanya bisa diakses jika sudah login */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                {/* Halaman not found */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </BlogProvider>
        </ShopProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
