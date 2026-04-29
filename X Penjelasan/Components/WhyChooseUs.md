# Bedah Kode: WhyChooseUs.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen "Kenapa Memilih Kami" yang memberikan alasan kuat bagi user untuk memilih Loka Coffee.

---

## 📂 Lokasi File
`src/components/WhyChooseUs.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Bullet Points Data
Mengelola daftar alasan dalam bentuk array string sederhana.

```tsx
const reasons = [
  "Biji kopi single-origin dari Toraja, Gayo, dan Flores",
  "Di-roast segar setiap minggu untuk menjaga aroma",
  "Barista berpengalaman yang passionate",
  "Harga bersahabat tanpa mengorbankan kualitas",
];
```
> **Analisis Logika**:
> - **Simplicity**: Karena alasan ini hanya berupa teks tanpa ikon yang berbeda-beda, kita menggunakan array string biasa. Logikanya adalah mempermudah pengelolaan teks tanpa perlu struktur objek yang kompleks.

### 2. ID Navigation (Smooth Scroll)
Menghubungkan section ini dengan navigasi eksternal.

```tsx
<section id="about" className="section-padding bg-card">
```
> **Analisis Logika**:
> - **Anchor Logic**: Pemberian `id="about"` memungkinkan komponen ini menjadi target navigasi dari tombol "Tentang Kami" yang ada di Hero Section. Saat link dengan href `#about` diklik, browser otomatis menggulir ke bagian ini.

### 3. Layout Konten & Gambar
Menyeimbangkan antara teks penjelasan dan elemen visual.

```tsx
<div className="section-container grid items-center gap-10 md:grid-cols-2">
  <img src={whyChooseUsImage} className="aspect-[4/3] w-full rounded-lg" />
  <div>
    {/* Teks & List... */}
  </div>
</div>
```
> **Analisis Logika**:
> - **Standard 50/50 Split**: Menggunakan `grid-cols-2` pada desktop untuk membagi layar menjadi dua bagian yang sama besar. Gambar di satu sisi memberikan konteks visual, sementara teks di sisi lain memberikan informasi detail.
> - **`items-center`**: Menjaga agar teks yang mungkin lebih pendek tetap berada di tengah secara vertikal sejajar dengan gambar.

### 4. Custom List (Bullet Check)
Membuat daftar yang lebih menarik daripada peluru (bullet) standar HTML.

```tsx
{reasons.map((r) => (
  <li key={r} className="flex items-start gap-3">
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
      <Check size={12} className="text-primary" />
    </span>
    <span className="font-body text-sm text-foreground">{r}</span>
  </li>
))}
```
> **Analisis Logika**:
> - **Checklist UX**: Penggunaan ikon `Check` secara psikologis memberikan kesan "positif" dan "terverifikasi".
> - **Alignment**: `items-start` dipadukan dengan `mt-0.5` pada ikon memastikan bahwa jika teks deskripsi lebih dari satu baris, ikon centang tetap sejajar dengan baris pertama teks, bukan berada di tengah-tengah.

---

## 🎨 Ringkasan Fitur
1. **Asset Optimization**: Menggunakan gambar dengan rasio `4:3` untuk tampilan yang proporsional.
2. **Branding Colors**: Menggunakan variasi `bg-primary/15` untuk latar belakang ikon centang agar kontras namun tetap lembut.
3. **Readable Typography**: Kombinasi `text-sm` (pada list) dan `text-base` (pada paragraf) untuk kenyamanan membaca yang optimal.
