# Bedah Kode: FeaturedProducts.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen Produk Unggulan yang menampilkan item terbaik dari katalog Loka Coffee.

---

## 📂 Lokasi File
`src/components/FeaturedProducts.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Integrasi Data & Filter
Komponen ini mengambil data produk dari context global dan melakukan penyaringan (*filtering*).

```tsx
const { products, isLoading } = useShop();

// Ambil produk bestseller sebagai unggulan
const featured = products.filter((p) => p.isBestseller).slice(0, 4);
```
> **Analisis Logika**:
> - **Global State**: Menggunakan `useShop` memastikan komponen selalu mendapatkan data terbaru dari server/database.
> - **Logic Filter**: Filter `.filter((p) => p.isBestseller)` memastikan hanya produk dengan status "bestseller" yang tampil. Kita menggunakan `.slice(0, 4)` untuk membatasi tampilan hanya 4 produk agar layout tetap simetris di halaman utama.

### 2. Penanganan Loading (Skeleton UI)
Memberikan pengalaman pengguna yang baik saat data masih dalam proses pengambilan.

```tsx
if (isLoading && products.length === 0) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 ...">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
```
> **Analisis Logika**:
> - **`animate-pulse`**: Memberikan efek animasi berkedip pada kotak abu-abu (`bg-muted`). Logikanya adalah memberi isyarat visual kepada user bahwa "konten sedang dimuat" daripada hanya menampilkan layar kosong.

### 3. Kartu Produk & Interaksi Hover
Membangun elemen kartu yang menarik dan interaktif.

```tsx
<Link to={`/product/${p.slug}`} className="group ... hover:shadow-lg">
  <img src={p.image} className="... transition-transform duration-500 group-hover:scale-105" />
</Link>
```
> **Analisis Logika**:
> - **Group Hover**: Kita menggunakan class `group` pada elemen induk (`Link`) agar saat link di-hover, elemen di dalamnya (seperti `img`) bisa bereaksi. Contohnya `group-hover:scale-105` yang membuat gambar sedikit membesar saat kartu didekati.
> - **Dynamic Links**: Menggunakan *backticks* (`` ` ``) untuk membuat URL dinamis berdasarkan slug produk (`/product/${p.slug}`).

### 4. Fitur "Add to Cart" Tanpa Navigasi
Menangani tombol beli tanpa mengganggu alur navigasi user.

```tsx
<button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(p, 1);
    toast.success(`${p.name} ditambahkan`);
  }}
>
  <ShoppingCart size={14} />
</button>
```
> **Analisis Logika**:
> - **Event Bubbling Control**: Ini bagian yang sangat penting. Karena tombol berada di DALAM tag `<Link>`, klik pada tombol secara normal akan memicu pindah halaman.
> - **`e.preventDefault()` & `e.stopPropagation()`**: Digunakan untuk "menghentikan" sinyal klik agar hanya diproses oleh fungsi tambah keranjang, bukan oleh fungsi navigasi Link.

---

## 🎨 Ringkasan Fitur
1. **Currency Formatting**: Menggunakan `.toLocaleString("id-ID")` untuk format harga Rupiah yang rapi.
2. **Visual Rating**: Ikon bintang (` Star`) dengan warna primer untuk menunjukkan kualitas produk.
3. **Responsive Grid**: Layout 2 kolom (mobile) dan 4 kolom (desktop) untuk memaksimalkan penggunaan layar.
