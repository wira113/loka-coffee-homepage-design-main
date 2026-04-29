# Bedah Kode: Categories.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen Kategori Menu yang memudahkan user menjelajahi jenis produk di Loka Coffee.

---

## 📂 Lokasi File
`src/components/Categories.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Metadata Mapping (UI Logic)
Menghubungkan nama kategori dari data pusat dengan gaya tampilan (warna/deskripsi) lokal.

```tsx
const categoryMeta: Record<string, { image: string; desc: string }> = {
  Coffee: { image: "bg-secondary", desc: "Espresso, Latte, Cappuccino & more" },
  "Non-Coffee": { image: "bg-primary/50", desc: "Matcha, Smoothie, Chocolate" },
  "Makanan Ringan": { image: "bg-muted", desc: "Croissant, Cake, Banana Bread" },
};
```
> **Analisis Logika**:
> - **Separation of Concerns**: Data nama kategori berasal dari `data/products.ts`, tetapi detail estetika (seperti warna background) dikelola secara lokal di dalam komponen ini. Logikanya adalah agar tim desain bisa mengubah tampilan kategori tanpa harus mengubah struktur data inti produk.

### 2. Dynamic Component Rendering
Merender kartu kategori secara otomatis berdasarkan data yang tersedia.

```tsx
{categories.map((cat) => {
  const meta = categoryMeta[cat];
  return (
    <a key={cat} className="group relative ...">
      {/* Konten Kartu */}
    </a>
  );
})}
```
> **Analisis Logika**:
> - **Automatic Sync**: Jika di kemudian hari ada kategori baru (misal: "Merchandise"), kita cukup menambahkannya di `categoryMeta`. Jika tidak ada di meta, kode mungkin akan error atau butuh *fallback*. Logika mapping ini memastikan UI selalu sinkron dengan daftar kategori yang ada.

### 3. Visual Layering (Z-Index Logic)
Menggunakan teknik penumpukan elemen untuk menciptakan desain kartu yang informatif.

```tsx
<div className={`${meta.image} aspect-[3/2] ... group-hover:scale-105`} />
<div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t ...">
  {/* Teks di atas background */}
</div>
```
> **Analisis Logika**:
> - **Overlay Background**: Lapisan pertama adalah warna/gambar kategori. Lapisan kedua adalah `absolute inset-0` dengan `bg-gradient-to-t`.
> - **Gradient Logic**: Gradien dari hitam ke transparan (`from-foreground/60 to-transparent`) memastikan bahwa teks berwarna putih di atasnya selalu terbaca dengan jelas (*high contrast*), secerah apa pun warna latar belakang di bawahnya.

### 4. Hover Micro-Interactions
Memberikan isyarat visual saat user berinteraksi dengan kategori.

```tsx
<span className="... transition-transform group-hover:translate-x-1">
  Lihat Semua <ArrowRight size={14} />
</span>
```
> **Analisis Logika**:
> - **Directional Feedback**: Menggunakan `translate-x-1` pada ikon panah saat di-hover memberikan kesan "dorongan" ke depan, secara psikologis mengajak user untuk mengklik dan melihat lebih lanjut.

---

## 🎨 Ringkasan Fitur
1. **Aspect Ratio Lock**: Menggunakan `aspect-[3/2]` agar semua kartu kategori memiliki ukuran yang seragam secara horizontal.
2. **Accessible Links**: Menggunakan tag `<a>` untuk navigasi kategori yang standar.
3. **Responsive Grid**: Otomatis menyusun menjadi 3 kolom pada layar desktop (`md:grid-cols-3`).
