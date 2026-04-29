# Bedah Kode: Navbar.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen Navbar pada proyek Loka Coffee secara mendalam.

---

## 📂 Lokasi File
`src/components/Navbar.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Import & Konfigurasi Link
Bagian ini mengimpor semua library yang dibutuhkan dan mendefinisikan daftar menu navigasi agar mudah dikelola.

```tsx
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "react-use-cart";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Booking", href: "/booking" },
  { label: "About", href: "/about" },
];
```
> **Penjelasan**: 
> - **Lucide React**: Digunakan untuk ikon standar yang ringan dan konsisten.
> - **navLinks**: Array objek yang memudahkan kita menambah atau mengubah menu navigasi tanpa harus menyentuh kode JSX.

### 2. State Management & Hooks
Di sini kita mengelola status internal komponen seperti membuka menu mobile atau bar pencarian.

```tsx
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  
  const { items } = useCart();
  const { setSearchQuery } = useShop();
  const { isAuthenticated } = useAuth();
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Menghitung total quantity item di keranjang
  const totalCartItems = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
```
> **Analisis Logika**:
> - **`mobileOpen` (State)**: 
>   - **Kegunaan**: Mengontrol buka-tutup menu navigasi pada layar HP (mobile).
>   - **Logic**: Awalnya bernilai `false`. Saat tombol Hamburger di klik, fungsi `setMobileOpen(!mobileOpen)` akan membalikkan nilainya (toggle). Menu mobile hanya akan muncul jika `mobileOpen` bernilai `true` **DAN** `searchOpen` bernilai `false`. Ini memastikan menu tidak menumpuk di atas bar pencarian.
>   - **Auto-Close**: Di setiap Link menu mobile, terdapat `onClick={() => setMobileOpen(false)}`. Logikanya adalah agar setelah user memilih menu, dropdown otomatis menutup sehingga tidak menghalangi konten halaman baru.
> - **`searchOpen` (State)**: Menggunakan boolean untuk melakukan *toggle* UI. Saat `true`, seluruh menu navigasi di tengah akan digantikan oleh form pencarian. Ini menghemat ruang (space-efficient) tanpa menambah tinggi navbar.
> - **`totalCartItems` (Memoization Logic)**: Fungsi `reduce` di sini sangat krusial. Jika user membeli 2 Kopi Latte dan 1 Espresso, `totalUniqueItems` akan bernilai 2, tapi `totalCartItems` akan bernilai 3. Kita menggunakan `item.quantity ?? 1` sebagai pengaman jika data kuantitas belum terdefinisi.

### 3. Logika Pencarian (Search Logic)
Fungsi-fungsi ini menangani interaksi saat user mencari produk.

```tsx
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = localQuery.trim();
    setSearchQuery(q);
    if (q) navigate("/products");
    setSearchOpen(false);
  };
```
> **Analisis Logika**:
> - **Ref & Focus**: Mengapa menggunakan `useRef`? Karena kita butuh akses langsung ke elemen DOM input tanpa menunggu render ulang React selesai. `useEffect` mendeteksi kapan `searchOpen` berubah menjadi `true`, lalu langsung memanggil `.focus()` agar user bisa langsung mengetik tanpa harus mengklik kolom input lagi.
> - **`handleSearchSubmit`**: Fungsi ini mensinkronisasikan state lokal (`localQuery`) ke state global (`setSearchQuery`). Dengan memanggil `navigate("/products")`, kita memastikan user melihat hasil pencarian di halaman katalog produk.

### 4. Struktur UI (JSX)
Navbar menggunakan teknik *Conditional Rendering* untuk berganti mode.

```tsx
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="section-container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-bold ...">Loka Coffee</Link>

        {searchOpen ? (
          /* Tampilan Mode Pencarian */
          <form onSubmit={handleSearchSubmit} className="...">
            <input ref={inputRef} ... />
            <button type="submit"> <Search size={16} /> </button>
          </form>
        ) : (
          /* Tampilan Menu Navigasi Biasa */
          <>
            <ul className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link to={link.href}>{link.label}</Link>
              ))}
            </ul>
            
            {/* Ikon Aksi (User, Cart, Mobile Menu) */}
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} />
              {/* Badge angka jika keranjang isi */}
              {totalCartItems > 0 && <span>{totalCartItems}</span>}
            </div>
          </>
        )}
      </div>
    </nav>
  );
```
> **Analisis Logika**:
> - **Backdrop Blur**: Menggunakan `bg-background/80` (transparansi 80%) dikombinasikan dengan `backdrop-blur-md`. Logikanya adalah membiarkan konten di bawah navbar terlihat samar saat di-scroll, menciptakan kedalaman visual (z-axis depth).
> - **Conditional Rendering (Ternary Operator)**: Kita menggunakan `{searchOpen ? (Form) : (Nav)}`. Secara logika, ini adalah "exclusive-OR"; hanya satu mode yang bisa aktif di satu waktu, mencegah tabrakan UI antara menu dan bar pencarian.
> - **Auth State Feedback**: Logika `{isAuthenticated && (...)}` pada ikon User memberikan feedback instan kepada user bahwa mereka sedang dalam sesi aktif tanpa harus membuka halaman profil terlebih dahulu.

---

## 🎨 Ringkasan Fitur
1. **Interactive Search**: Bar pencarian yang *seamless*.
2. **Auth Integration**: Ikon user berubah warna jika sudah login.
3. **Cart Badge**: Notifikasi jumlah item di keranjang secara *real-time*.
4. **Mobile Friendly**: Menu hamburger yang bersih dan responsif.
