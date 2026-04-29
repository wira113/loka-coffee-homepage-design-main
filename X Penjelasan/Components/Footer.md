# Bedah Kode: Footer.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen Footer yang menutup halaman dengan informasi penting dan tautan sosial.

---

## 📂 Lokasi File
`src/components/Footer.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Inversi Warna (Dark Mode Logic)
Footer sering kali menggunakan warna yang berlawanan dengan isi website untuk memberikan tanda "akhir" halaman.

```tsx
<footer className="border-t border-border bg-foreground">
  <div className="... text-primary-foreground">
```
> **Analisis Logika**:
> - **Inverted Design**: Menggunakan `bg-foreground` (yang biasanya berwarna gelap atau hitam) dan `text-primary-foreground` (warna terang). Logikanya adalah menciptakan kontras yang kuat sehingga user menyadari bahwa mereka telah mencapai bagian terbawah website.
> - **Opacity for Hierarchy**: Menggunakan `text-primary-foreground/70` atau `/50` untuk teks deskripsi. Logikanya adalah agar teks judul tetap paling menonjol, sementara informasi pendukung terlihat lebih redup dan tidak mengalihkan perhatian.

### 2. Navigasi Footer (Mapping Lists)
Mengorganisir tautan navigasi ke dalam kategori-kategori.

```tsx
{["Coffee", "Non-Coffee", "Makanan Ringan"].map((l) => (
  <li key={l}>
    <a href="#" className="... hover:text-primary-foreground">{l}</a>
  </li>
))}
```
> **Analisis Logika**:
> - **Modular Lists**: Dengan memetakan array string ke elemen `<li>`, kita membuat kode lebih ringkas dan mudah diubah. Logikanya adalah penghematan baris kode (*Dry Principle*) dibandingkan menulis tag `<a>` secara manual satu per satu.

### 3. Ikon Sosial Media (Dynamic Icon Loop)
Menampilkan daftar media sosial dengan gaya yang seragam.

```tsx
{[Instagram, Facebook, Twitter].map((Icon, i) => (
  <a key={i} href="#" className="flex h-9 w-9 ... rounded-full border border-primary-foreground/20">
    <Icon size={16} />
  </a>
))}
```
> **Analisis Logika**:
> - **Icon as Variable**: Komponen Lucide React (`Instagram`, dll) diperlakukan sebagai variabel `Icon` di dalam loop.
> - **Visual Consistency**: Setiap ikon dibungkus dalam lingkaran (`rounded-full`) dengan ukuran yang sama (`h-9 w-9`). Garis tepi yang tipis (`border-primary-foreground/20`) memberikan sentuhan elegan tanpa terlihat terlalu tebal.

### 4. Hak Cipta & Garis Penutup (Legal Section)
Bagian paling bawah untuk informasi hak cipta.

```tsx
<div className="border-t border-primary-foreground/10 py-4">
  <p className="text-center ... text-primary-foreground/40">
    © 2026 Loka Coffee. All rights reserved.
  </p>
</div>
```
> **Analisis Logika**:
> - **Final Border**: Garis pemisah di atas teks hak cipta menggunakan transparansi yang sangat rendah (`/10`) agar terlihat sangat halus. Logikanya adalah memisahkan konten utama footer dengan informasi legal secara visual namun tetap dalam satu kesatuan tema gelap.

---

## 🎨 Ringkasan Fitur
1. **Multi-Column Layout**: Membagi informasi menjadi 4 kolom pada desktop (`md:grid-cols-4`).
2. **Transition Effects**: Efek transisi warna saat link di-hover (`transition-colors`).
3. **Typography Scaling**: Menggunakan `text-xs` dan `text-sm` untuk menjaga proporsi informasi di bagian bawah halaman.
4. **Responsive Padding**: Jarak antar elemen yang menyesuaikan ukuran layar (`py-12` ke `py-16`).
