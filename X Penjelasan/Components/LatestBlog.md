# Bedah Kode: LatestBlog.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen Blog Terbaru yang menyajikan berita dan artikel terkini dari Loka Coffee.

---

## 📂 Lokasi File
`src/components/LatestBlog.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Data Slicing (Selection Logic)
Memilih data yang ingin ditampilkan agar tidak memenuhi layar.

```tsx
import { blogs } from "@/data/products";

// Ambil 3 blog terbaru dari array blogs
const latestBlogs = blogs.slice(0, 3);
```
> **Analisis Logika**:
> - **Limited Preview**: Data blog mungkin berisi puluhan artikel, tapi untuk halaman utama kita hanya butuh cuplikan. Logika `.slice(0, 3)` memastikan hanya 3 artikel teratas (terbaru) yang diproses. Ini menghemat memori browser karena tidak perlu merender elemen yang tidak terlihat.

### 2. Efek Visual & Zoom (Interaction Logic)
Meningkatkan keterlibatan user melalui feedback visual.

```tsx
<div className={`${blog.image} aspect-[16/10] ... group-hover:scale-105`} />
```
> **Analisis Logika**:
> - **Dynamic Classes**: Kelas `${blog.image}` digunakan untuk menentukan gambar latar belakang.
> - **Smooth Zoom**: Penggunaan `transition-transform duration-500` dikombinasikan dengan `scale-105` memberikan efek zoom-in yang halus saat kursor berada di atas artikel. Logikanya adalah membuat artikel terasa "hidup" dan menarik untuk diklik.

### 3. Konten & Truncation (Text Logic)
Menjaga agar tampilan kartu tetap seragam meskipun panjang teks berbeda-beda.

```tsx
<p className="mt-2 font-body text-xs ... line-clamp-2">
  {blog.excerpt}
</p>
```
> **Analisis Logika**:
> - **Line Clamping**: Ini adalah teknik CSS yang sangat penting. Logikanya adalah memotong teks deskripsi secara otomatis jika melebihi 2 baris (`line-clamp-2`). Ini memastikan tinggi semua kartu blog tetap sama dan tidak berantakan (asimetris).

### 4. Info Meta (Hierarchy Logic)
Menampilkan informasi pendukung dengan porsi yang pas.

```tsx
<span className="rounded-full bg-primary/10 ... text-primary">
  {blog.category}
</span>
<span className="..."> {blog.date} </span>
```
> **Analisis Logika**:
> - **Information Hierarchy**: Kategori diberikan latar belakang berwarna lembut (`bg-primary/10`) agar menonjol, sementara tanggal menggunakan warna abu-abu (`text-muted-foreground`) karena sifatnya sebagai informasi sekunder. Logika ini membantu mata user menangkap kategori artikel terlebih dahulu sebelum detail teknis seperti tanggal.

---

## 🎨 Ringkasan Fitur
1. **Aspect Ratio**: Menggunakan `aspect-[16/10]` untuk proporsi gambar artikel yang sinematik.
2. **Responsive Grid**: Layout 1 kolom pada mobile dan 3 kolom pada desktop (`md:grid-cols-3`).
3. **Semantic Tags**: Menggunakan tag `<article>` yang baik untuk SEO daripada sekadar `<div>`.
