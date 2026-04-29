# Bedah Kode: ValueBar.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen Value Bar yang menampilkan keunggulan utama Loka Coffee.

---

## 📂 Lokasi File
`src/components/ValueBar.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Definisi Data (Static Content)
Menggunakan array objek untuk menyimpan poin-poin keunggulan agar tampilan tetap bersih dan mudah dikelola.

```tsx
import { Truck, ShieldCheck, Coffee, Heart } from "lucide-react";

const values = [
  { icon: Coffee, title: "Biji Kopi Premium", desc: "..." },
  { icon: Truck, title: "Pengiriman Cepat", desc: "..." },
  { icon: ShieldCheck, title: "Kualitas Terjamin", desc: "..." },
  { icon: Heart, title: "Dibuat dengan Cinta", desc: "..." },
];
```
> **Analisis Logika**:
> - **Data-Driven UI**: Dengan memisahkan data (`values`) dari tampilan, kita bisa dengan mudah menambah atau menghapus poin keunggulan tanpa perlu menulis ulang elemen HTML berkali-kali.
> - **Dynamic Icons**: Perhatikan bahwa kita menyimpan komponen ikon (`Coffee`, `Truck`, dll) langsung di dalam objek. Ini memungkinkan kita merender ikon tersebut secara dinamis di dalam loop.

### 2. Layout Grid & Perulangan (Mapping)
Mengatur susunan elemen agar rapi di berbagai ukuran layar.

```tsx
<div className="section-container grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:gap-8 md:py-14">
  {values.map((v) => (
    <div key={v.title} className="flex flex-col items-center text-center">
      {/* Konten tiap item... */}
    </div>
  ))}
</div>
```
> **Analisis Logika**:
> - **Responsivitas Grid**: Menggunakan `grid-cols-2` (mobile) dan `md:grid-cols-4` (desktop). Logikanya, pada layar kecil kita menampilkan 2 kolom agar teks tidak terlalu sempit, dan pada layar besar kita sejajarkan semua menjadi 4 kolom secara horizontal.
> - **Flex Alignment**: `flex flex-col items-center text-center` memastikan ikon, judul, dan teks deskripsi selalu berada di tengah-tengah kontainernya secara simetris.

### 3. Styling Ikon
Memberikan aksen visual yang konsisten dengan brand.

```tsx
<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
  <v.icon size={22} className="text-primary" />
</div>
```
> **Analisis Logika**:
> - **Visual Hierarchy**: Menggunakan latar belakang lingkaran dengan warna primer yang sangat tipis (`bg-primary/10`) membuat ikon tetap menonjol (`text-primary`) namun tidak terlihat terlalu berat/mencolok di mata.
> - **Icon Wrapper**: Ukuran kontainer ikon dikunci (`h-12 w-12`) agar jika ada ikon yang memiliki proporsi berbeda, mereka tetap terlihat sejajar satu sama lain.

---

## 🎨 Ringkasan Fitur
1. **Clean Typography**: Menggunakan ukuran font kecil (`text-sm` dan `text-xs`) untuk memberikan kesan minimalis dan informatif.
2. **Efficient Rendering**: Menggunakan `.map()` untuk efisiensi kode.
3. **Strategic Positioning**: Diletakkan tepat di bawah Hero Section untuk membangun kepercayaan (*trust building*) sesaat setelah user mendarat di website.
