# Bedah Kode: ProtectedRoute.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen Rute Terproteksi yang menjaga keamanan halaman khusus anggota (seperti Dashboard atau Profile).

---

## 📂 Lokasi File
`src/components/ProtectedRoute.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Auth State Check (Security Logic)
Memantau status login pengguna sebelum memberikan akses.

```tsx
const { isAuthenticated, user, isLoading } = useAuth();
```
> **Analisis Logika**:
> - **Centralized Auth**: Komponen ini bergantung sepenuhnya pada `AuthContext`. Logikanya adalah menggunakan satu sumber kebenaran (*single source of truth*) untuk menentukan apakah seorang user valid atau tidak.

### 2. Loading Guard (UX Integrity)
Menghindari "flash" konten atau redirect yang salah saat status login sedang diperiksa.

```tsx
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
```
> **Analisis Logika**:
> - **State Awareness**: Karena pengecekan token ke server/storage memakan waktu (asinkron), kita harus menampilkan spinner. Logikanya adalah mencegah aplikasi mengambil keputusan redirect ke `/login` terlalu cepat sebelum status aslinya diketahui.

### 3. Redirect Logic (Navigation Security)
Mengalihkan user yang tidak sah ke halaman yang tepat.

```tsx
if (!isAuthenticated || !user) {
  return <Navigate to="/login" replace />;
}
```
> **Analisis Logika**:
> - **Bouncer Logic**: Jika user mencoba mengakses halaman terlarang (misal: `/profile`) tanpa login, komponen ini bertindak sebagai "bouncer" yang mengusir mereka ke halaman `/login`.
> - **`replace` Prop**: Menggunakan `replace` dalam `<Navigate />` secara logika berarti menghapus halaman yang dilarang tadi dari riwayat browser (history), sehingga jika user menekan tombol "Back", mereka tidak akan terjebak dalam loop redirect.

### 4. Wrapper Content (Composition Logic)
Menampilkan konten asli jika syarat keamanan terpenuhi.

```tsx
return <>{children}</>;
```
> **Analisis Logika**:
> - **Higher-Order Component (HOC)**: Komponen ini membungkus komponen lain (`children`). Logikanya adalah memisahkan logika keamanan dari logika tampilan halaman. Halaman profil tidak perlu tahu cara mengecek login; cukup dibungkus oleh `ProtectedRoute`.

---

## 🎨 Ringkasan Fitur
1. **Seamless Security**: Melindungi rute sensitif secara otomatis.
2. **Global Integration**: Terhubung langsung dengan sistem autentikasi aplikasi.
3. **Optimized UX**: Menyertakan loading spinner untuk transisi yang halus.
4. **Clean Implementation**: Bisa digunakan dengan mudah di `App.tsx` atau router config cukup dengan membungkus elemen rute.
