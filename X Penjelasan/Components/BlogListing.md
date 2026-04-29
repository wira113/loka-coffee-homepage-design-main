# Bedah Kode: BlogListing.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik halaman Daftar Blog yang mengelola penyajian artikel Loka Coffee secara dinamis.

---

## 📂 Lokasi File
`src/components/BlogListing.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Centralized Blog Context
Menggunakan context terpusat untuk mengelola state pencarian dan filter.

```tsx
const {
  filteredBlogs,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  blogCategories,
} = useBlog();
```
> **Analisis Logika**:
> - **State Sync**: Dengan menggunakan `useBlog()`, semua logika filter (berdasarkan kata kunci dan kategori) tidak ditulis di dalam komponen ini, melainkan di dalam Context. Logikanya adalah agar state blog tetap konsisten jika user berpindah-pindah halaman atau jika ada komponen lain (seperti sidebar) yang juga butuh data blog.

### 2. Search & Category Filter (Interaction Logic)
Memungkinkan user menemukan artikel dengan cepat.

```tsx
<Input
  placeholder="Cari artikel..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

{blogCategories.map((cat) => (
  <button onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}>
    {cat}
  </button>
))}
```
> **Analisis Logika**:
> - **Real-time Search**: Setiap karakter yang diketik user langsung memicu render ulang daftar blog melalui `setSearchQuery`.
> - **Toggle Category**: Logika `selectedCategory === cat ? null : cat` memungkinkan user mengklik kembali kategori yang sedang aktif untuk mematikan filter (kembali ke "Semua"). Ini adalah pola interaksi yang intuitif.

### 3. Image Handling & Fallback
Menampilkan gambar artikel dari API dengan sistem pengaman.

```tsx
<img
  src={`${import.meta.env.VITE_API_URL}${blog.image}`}
  onError={(e) => {
    const img = e.target as HTMLImageElement;
    img.src = "https://placehold.co/600x400?text=Loka+Coffee";
  }}
/>
```
> **Analisis Logika**:
> - **Base URL Prep**: Karena database hanya menyimpan jalur file (misal: `/uploads/blog1.jpg`), kita harus menggabungkannya dengan `VITE_API_URL` agar browser bisa menemukan gambarnya.
> - **Error Resilience**: Fungsi `onError` secara logika berfungsi sebagai "asuransi". Jika gambar di server terhapus atau link-nya rusak, website tidak akan terlihat berantakan karena otomatis digantikan oleh gambar placeholder.

### 4. Card Animation & Typography
Meningkatkan pengalaman visual saat menjelajah.

```tsx
<Link className="group transition-all hover:-translate-y-1 hover:shadow-md">
  <h2 className="... transition-colors group-hover:text-primary">
    {blog.title}
  </h2>
</Link>
```
> **Analisis Logika**:
> - **Lift Effect**: Penambahan `hover:-translate-y-1` memberikan efek kartu yang seolah-olah terangkat saat didekati kursor. Logikanya adalah memberikan feedback fisik (kedalaman) kepada user.
> - **Color Transition**: Judul artikel berubah warna menjadi warna primer saat di-hover, memberikan indikasi kuat bahwa elemen tersebut bisa diklik.

---

## 🎨 Ringkasan Fitur
1. **Line Clamp**: Membatasi ringkasan artikel hanya 2 baris agar layout grid tetap sejajar.
2. **Context-Aware Footer/Navbar**: Menggunakan komponen global untuk konsistensi desain.
3. **Responsive Grid**: Layout yang fleksibel dari 1 kolom hingga 3 kolom sesuai lebar layar.
4. **Empty State**: Menampilkan pesan khusus jika hasil pencarian tidak ditemukan.
