# Bedah Kode: Testimonials.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen Testimoni yang menampilkan pengalaman nyata pelanggan Loka Coffee.

---

## 📂 Lokasi File
`src/components/Testimonials.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Dekorasi Ikon Kutip (Visual Cue)
Menggunakan ikon dekoratif untuk mempertegas fungsi elemen sebagai kutipan.

```tsx
import { Quote } from "lucide-react";

<Quote size={24} className="text-primary/30" />
```
> **Analisis Logika**:
> - **Visual Metaphor**: Ikon tanda kutip (`Quote`) secara instan memberitahu user bahwa teks di bawahnya adalah kata-kata seseorang. Menggunakan `text-primary/30` (transparansi 30%) logikanya adalah agar ikon tetap terlihat sebagai identitas brand namun tidak mengalihkan perhatian dari teks testimoni yang sebenarnya.

### 2. Iterasi Rating Bintang (Dynamic Rendering)
Menampilkan jumlah bintang secara dinamis berdasarkan angka rating dari data.

```tsx
{Array.from({ length: t.rating }).map((_, i) => (
  <Star key={i} size={14} className="fill-primary text-primary" />
))}
```
> **Analisis Logika**:
> - **Array Generation**: Karena data rating berupa angka (misal: 5), kita menggunakan `Array.from({ length: t.rating })` untuk membuat array sementara agar bisa di-loop menggunakan `.map()`. Logikanya adalah mempermudah pembuatan elemen berulang sesuai nilai numerik.
> - **SVG Fill**: Penggunaan `fill-primary` memastikan bintang terlihat penuh (solid), bukan hanya garis tepi.

### 3. Struktur Kartu & Footer
Memisahkan antara isi pesan dan identitas pemberi pesan.

```tsx
<div className="mt-4 border-t border-border pt-4">
  <p className="font-display text-sm font-semibold">{t.name}</p>
  <p className="font-body text-xs text-muted-foreground">{t.role}</p>
</div>
```
> **Analisis Logika**:
> - **Separation of Content**: Penggunaan `border-t` (garis atas) secara logika memberikan batas yang jelas antara kutipan emosional dan data teknis (nama/pekerjaan). Ini meningkatkan keterbacaan (*readability*) kartu testimoni.

### 4. Layout Grid
Menyusun testimoni agar terlihat padat dan rapi.

```tsx
<div className="grid gap-6 md:grid-cols-3">
  {testimonials.map((t) => (
    <div key={t.id} className="bg-card p-6 md:p-8"> ... </div>
  ))}
</div>
```
> **Analisis Logika**:
> - **Adaptive Padding**: Menggunakan `p-6` pada mobile dan `p-8` pada desktop. Logikanya adalah menyesuaikan ruang kosong (*white space*) dengan ukuran layar agar kartu tidak terlihat terlalu sempit di layar besar.

---

## 🎨 Ringkasan Fitur
1. **Social Proof**: Menampilkan testimoni asli untuk meningkatkan kepercayaan pengunjung baru.
2. **Typography Contrast**: Judul menggunakan font *Display* yang tebal, sementara isi testimoni menggunakan font *Body* yang nyaman dibaca.
3. **Card Shadow**: (Biasanya ditangani via class `bg-card` atau border) memberikan efek kedalaman visual.
4. **Responsive Grid**: Otomatis menjadi 1 kolom di HP dan 3 kolom di Desktop.
