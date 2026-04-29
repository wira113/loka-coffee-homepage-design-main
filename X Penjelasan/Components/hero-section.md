# Bedah Kode: HeroSection.tsx

Dokumen ini menjelaskan struktur kode dan logika desain di balik komponen Hero Section (halaman beranda) pada halaman utama Loka Coffee.

---

## 📂 Lokasi File
`src/components/HeroSection.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Import & Assets
Bagian ini mengelola ketergantungan library dan aset visual yang digunakan sebagai daya tarik utama.

```tsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-coffee.jpg";
```
> **Analisis Logika**:
> - **`Link` (react-router-dom)**: 
>   - **SPA Logic**: Berbeda dengan tag `<a>` biasa, `Link` tidak melakukan reload halaman penuh. Logikanya adalah mencegat (*intercept*) navigasi browser dan hanya mengganti komponen di dalam layar. Ini membuat perpindahan halaman terasa instan (Single Page Application).
>   - **SEO & Accessibility**: Meskipun berperilaku seperti JavaScript, secara DOM ia tetap dirender sebagai tag `<a>`, sehingga tetap ramah terhadap mesin pencari (SEO) dan pembaca layar (accessibility).
> - **`heroImage`**: Diimpor langsung sebagai aset statis. Hal ini memastikan gambar teroptimasi oleh proses *build* (seperti Vite) dan memiliki jalur (path) yang benar saat dideploy.
> - **`ArrowRight`**: Ikon simpel untuk memberikan isyarat visual bahwa tombol tersebut adalah tautan yang akan mengarahkan user ke halaman lain.

### 2. Struktur Kontainer & Grid
Komponen ini menggunakan sistem grid untuk membagi layar menjadi dua bagian pada tampilan desktop.

```tsx
const HeroSection = () => (
  <section className="relative overflow-hidden bg-background">
    <div className="section-container grid items-center gap-8 py-16 md:grid-cols-2 md:gap-12 md:py-24 lg:py-32">
```
> **Analisis Logika**:
> - **`grid items-center`**: Memastikan konten teks dan gambar sejajar secara vertikal di tengah, menciptakan keseimbangan visual yang baik.
> - **`md:grid-cols-2`**: Logika responsif di mana pada layar mobile konten akan menumpuk secara vertikal (1 kolom), dan otomatis berubah menjadi 2 kolom saat lebar layar mencapai ukuran `md` (medium) ke atas.
> - **Padding Dinamis**: `py-16` (mobile) hingga `lg:py-32` (desktop). Memberikan "ruang bernapas" yang lebih luas pada layar besar untuk kesan premium.

### 3. Konten Teks & Call to Action (CTA)
Bagian ini fokus pada penyampaian pesan utama (*headline*) dan tombol aksi.

```tsx
<div className="order-2 md:order-1">
  <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
    Welcome to Loka Coffee
  </p>
  <h1 className="mt-3 font-display text-4xl font-bold ... md:text-5xl lg:text-6xl">
    Nikmati Kopi & Sajian Istimewa Setiap Hari
  </h1>
  <div className="mt-8 flex flex-wrap gap-3">
    <Link to="/products" className="bg-primary ... hover:scale-105">
      Beli Sekarang <ArrowRight size={16} />
    </Link>
  </div>
</div>
```
> **Analisis Logika**:
> - **`order-2 md:order-1`**: Pada mobile, teks muncul di bawah gambar (order 2). Namun pada desktop, teks bergeser ke kiri (order 1). Ini adalah strategi UX untuk menampilkan visual (gambar) terlebih dahulu di HP sebelum teks yang panjang.
> - **`hover:scale-105`**: Memberikan mikro-interaksi. Saat tombol didekati kursor, ia membesar sedikit (5%), memberikan *feedback* kepada user bahwa elemen tersebut interaktif.

### 4. Visual & Gambar Hero
Menampilkan elemen visual utama untuk membangun suasana (*atmosphere*).

```tsx
<div className="order-1 md:order-2">
  <div className="overflow-hidden rounded-2xl">
    <img
      src={heroImage}
      alt="Loka Coffee"
      className="aspect-[4/3] w-full object-cover"
    />
  </div>
</div>
```
> **Analisis Logika**:
> - **`rounded-2xl`**: Memberikan sudut yang melengkung halus (modern) daripada sudut tajam yang kaku.
> - **`aspect-[4/3]`**: Mengunci rasio aspek gambar. Ini sangat penting agar layout tidak "melompat" (Layout Shift) saat gambar sedang dimuat oleh browser.
> - **`object-cover`**: Memastikan gambar memenuhi seluruh area kontainer tanpa terlihat gepeng atau tertarik, meskipun ukuran layarnya berubah-ubah.

---

## 🎨 Ringkasan Fitur
1. **Responsive Reordering**: Menukar posisi teks dan gambar secara cerdas antara Mobile dan Desktop.
2. **Typography Hierarchy**: Penggunaan font *Display* untuk judul besar dan font *Body* untuk deskripsi agar mudah dibaca.
3. **Interactive CTA**: Tombol yang menonjol dengan efek transisi halus.
4. **Visual Consistency**: Desain yang bersih dengan sudut membulat yang konsisten dengan sistem desain Loka Coffee.
