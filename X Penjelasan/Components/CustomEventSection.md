# Bedah Kode: CustomEventSection.tsx

Dokumen ini menjelaskan struktur kode dan logika kompleks di balik sistem Booking Acara dan Kelas Kopi Loka Coffee.

---

## 📂 Lokasi File
`src/components/CustomEventSection.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Integrasi API & Fetching Data
Komponen ini dinamis karena mengambil data paket langsung dari backend.

```tsx
const [packages, setPackages] = useState<BookingPackage[]>([]);
const [packagesLoading, setPackagesLoading] = useState(true);

useEffect(() => {
  fetch(`${API_BASE_URL}/bookings/packages`)
    .then((r) => r.json())
    .then((data) => {
      if (data.status === "success" && Array.isArray(data.data)) {
        setPackages(data.data.filter((p) => p.is_active));
      }
    });
}, []);
```
> **Analisis Logika**:
> - **Environment Variables**: Menggunakan `import.meta.env.VITE_API_URL` agar alamat server bisa berubah otomatis antara tahap pengembangan (development) dan produksi.
> - **Data Integrity**: Kita melakukan `.filter((p) => p.is_active)` secara logika agar paket yang sudah dinonaktifkan di admin panel tidak muncul di website user.

### 2. Logika Seleksi Paket (Interactive Selection)
User harus memilih satu paket sebelum bisa mengisi form dengan valid.

```tsx
const [selectedPkg, setSelectedPkg] = useState<number | null>(null);

const onSelect = () => setSelectedPkg(selectedPkg === pkg.id ? null : pkg.id);
```
> **Analisis Logika**:
> - **Toggle Logic**: Jika user mengklik paket yang sudah terpilih, paket tersebut akan menjadi `null` (batal pilih). Ini adalah standar UX yang baik.
> - **Visual Feedback**: Komponen `PackageCard` akan berubah warna border dan ukurannya (`scale-[1.02]`) jika `selectedPkg === pkg.id`, memberikan kepastian visual kepada user.

### 3. Validasi Form Berbasis Kapasitas
Mencegah user memesan jumlah orang yang tidak sesuai dengan ketentuan paket.

```tsx
if (form.num_persons < selectedPackage.min_person || form.num_persons > selectedPackage.max_person) {
  toast.error(`Jumlah peserta harus antara ${selectedPackage.min_person}–${selectedPackage.max_person} orang.`);
  return;
}
```
> **Analisis Logika**:
> - **Business Rule Validation**: Setiap paket memiliki batasan fisik (contoh: kelas kopi max 5 orang, gathering min 20 orang). Logika ini memastikan data yang dikirim ke server sudah memenuhi kriteria bisnis, mengurangi beban kerja admin dalam menyortir pesanan yang tidak valid.

### 4. Penanganan Error Laravel (API Validation)
Menampilkan pesan error spesifik dari server ke field input masing-masing.

```tsx
if (response.status === 422 && result.errors) {
  const errs: Record<string, string> = {};
  for (const [key, messages] of Object.entries(result.errors)) {
    errs[key] = (messages as string[])[0];
  }
  setFieldErrors(errs);
}
```
> **Analisis Logika**:
> - **Mapping Error**: Laravel mengirimkan error dalam bentuk objek array. Kode ini "membedah" objek tersebut dan hanya mengambil pesan error pertama untuk ditampilkan di bawah input yang bersangkutan (`fieldErrors`). Ini sangat membantu user memperbaiki data yang salah.

### 5. Komponen FAQ (Accordion Logic)
Menampilkan tanya-jawab dengan cara yang hemat ruang.

```tsx
const [open, setOpen] = useState(false);
// ...
{open && <p className="..."> {a} </p>}
```
> **Analisis Logika**:
> - **Local State Isolation**: Setiap `FaqItem` punya state `open` masing-masing. Logikanya adalah agar satu pertanyaan yang dibuka tidak mempengaruhi pertanyaan lain (user bisa membuka banyak FAQ sekaligus atau menutup semuanya).

---

## 🎨 Ringkasan Fitur
1. **Dynamic Estimates**: Menghitung estimasi harga secara langsung (`price * num_persons`) saat user mengetik jumlah orang.
2. **Success State**: Menampilkan layar konfirmasi khusus setelah booking berhasil tanpa pindah halaman.
3. **Smooth Navigation**: Menggunakan `id="custom-event"` agar bisa diakses melalui link jangkar dari halaman lain.
4. **Responsive Design**: Form yang kompleks secara otomatis menyusun ulang input dari 2 kolom menjadi 1 kolom pada layar HP.
