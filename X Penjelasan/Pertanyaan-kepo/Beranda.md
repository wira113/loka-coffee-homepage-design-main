# Analisis Layout: Bagaimana Komponen Terpisah Menjadi Satu Halaman?

Mungkin Anda bertanya-tanya: *"Navbar ada di file sendiri, HeroSection ada di file sendiri, tapi kok pas dibuka di browser mereka terlihat menyatu dan rapi?"*

Hal ini terjadi karena konsep **Komposisi Komponen** di React.

---

## 🏗️ 1. Tempat Penyatuan: `src/pages/Index.tsx`

File `Index.tsx` bertindak sebagai **"Kontainer Utama"** atau "Lem" yang menyatukan semua bagian. Di sinilah Navbar dan HeroSection bertemu:

```tsx
// src/pages/Index.tsx
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />      {/* Barisan pertama */}
    <HeroSection /> {/* Barisan kedua, tepat di bawah Navbar */}
    ...
  </div>
);
```

### Logika Penyatuan:
- React merender komponen sesuai urutan baris kodenya. Karena `<Navbar />` ditulis sebelum `<HeroSection />`, maka Navbar akan muncul di paling atas.
- Keduanya dibungkus dalam satu `<div>` induk, sehingga browser menganggapnya sebagai satu kesatuan dokumen HTML.

---

## 🎨 2. Rahasia Visual: Mengapa Terlihat "Menyatu"?

Meskipun filenya terpisah, ada trik CSS di file `Navbar.tsx` yang membuatnya terasa sangat mulus dengan `HeroSection`:

### A. Posisi Sticky
```tsx
<nav className="sticky top-0 z-50 ...">
```
> **Logika**: `sticky top-0` memastikan Navbar tetap menempel di atas saat Anda men-scroll, tapi secara dokumen dia tetap mengambil ruang di atas HeroSection. `z-50` memastikan Navbar selalu berada "di atas" (lapisan lebih tinggi) dari konten lainnya jika terjadi tumpukan.

### B. Efek Transparansi & Blur (Glassmorphism)
```tsx
<nav className="... bg-background/80 backdrop-blur-md">
```
> **Logika**: 
> - **`bg-background/80`**: Memberikan transparansi 80%. Ini artinya warna latar belakang `HeroSection` akan sedikit terlihat menembus Navbar saat di-scroll.
> - **`backdrop-blur-md`**: Memberikan efek buram pada konten di belakangnya. Ini adalah kunci visual yang membuat transisi antara Navbar dan HeroSection terasa mewah dan menyatu.

---

## 🧩 Kesimpulan
Mereka digabung di file **`Index.tsx`** menggunakan konsep impor-ekspor, dan dibuat terlihat menyatu menggunakan **CSS Tailwind** (Sticky, Transparency, dan Blur). 

Dengan cara ini, kode tetap rapi (modular) karena tiap bagian punya file sendiri, tapi hasil akhirnya tetap terlihat sebagai satu desain yang utuh.
