# Bedah Kode: BlogDetail.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik halaman Detail Blog yang menyajikan isi artikel secara lengkap kepada pembaca.

---

## 📂 Lokasi File
`src/components/BlogDetail.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Dynamic Routing (Params Logic)
Mengidentifikasi artikel mana yang harus ditampilkan berdasarkan URL.

```tsx
const { id } = useParams<{ id: string }>();
const { blogs, isLoading } = useBlog();

const blog = blogs.find((b) => Number(b.id) === Number(id));
```
> **Analisis Logika**:
> - **URL Parameter**: Menggunakan `useParams` untuk menangkap ID unik dari alamat browser (misal: `/blog/1`).
> - **Data Matching**: Logika `.find()` mencari objek artikel di dalam array `blogs` yang ID-nya cocok dengan ID dari URL. Kita menggunakan `Number()` untuk memastikan perbandingan angka berjalan dengan benar meskipun parameter URL biasanya berupa string.


### 2. Safeguard Rendering (Null Checks)
Menangani kondisi saat data belum siap atau artikel tidak ada.

```tsx
if (isLoading) return <div>Memuat artikel...</div>;
if (!blog) return <div>Artikel Tidak Ditemukan</div>;
```
> **Analisis Logika**:
> - **UX Integrity**: Secara logika, kita tidak boleh mencoba merender `blog.title` jika `blog` masih bernilai `undefined`. Logika ini bertindak sebagai "penjaga gerbang" (guard clause) agar aplikasi tidak mengalami *crash* dan user mendapatkan informasi yang jelas.


### 3. Integrasi Gambar Backend
Menampilkan visual artikel dengan jalur file yang dinamis.

```tsx
<img
  src={`${import.meta.env.VITE_API_URL}${blog.image}`}
  className="aspect-video w-full object-cover"
/>
```
> **Analisis Logika**:
> - **Resolution & Aspect**: Menggunakan `aspect-video` (16:9) memastikan gambar hero artikel selalu terlihat lebar dan profesional.
> - **Path Concatenation**: Logika penggabungan string `${API_URL}${path}` memastikan browser memanggil alamat gambar yang lengkap ke server Laravel backend.


### 4. Artikel Terkait (Related Posts Logic)
Menyarankan artikel lain untuk menjaga minat pembaca.

```tsx
const relatedPosts = blogs.filter((b) => Number(b.id) !== blog.id).slice(0, 2);
```
> **Analisis Logika**:
> - **Exclusion Logic**: Logika `filter((b) => b.id !== blog.id)` memastikan artikel yang sedang dibaca TIDAK muncul kembali di daftar "Artikel Lainnya".
> - **Limited Recommendation**: Kita hanya mengambil 2 artikel (`slice(0, 2)`) agar tampilan rekomendasi tetap rapi dan tidak terlalu panjang di bawah halaman.

---

## 🎨 Ringkasan Fitur
1. **Breadcrumb Navigation**: Tombol "Kembali ke Blog" memudahkan user kembali ke daftar tanpa tombol back browser.
2. **Meta Info**: Menampilkan kategori, tanggal, dan penulis (`author`) secara berdampingan untuk kredibilitas artikel.
3. **Typography for Reading**: Paragraf menggunakan `leading-relaxed` (jarak baris yang pas) agar user tidak cepat lelah saat membaca artikel panjang.
4. **Responsive Container**: Menggunakan `md:p-8` untuk memberikan margin konten yang lebih luas pada layar besar.
