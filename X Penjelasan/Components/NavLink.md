# Bedah Kode: NavLink.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik komponen NavLink kustom yang memperluas kemampuan navigasi standar React Router.

---

## 📂 Lokasi File
`src/components/NavLink.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Kompatibilitas NavLink (Wrapper Logic)
Membungkus komponen asli agar mendukung sistem styling Tailwind yang lebih fleksibel.

```tsx
import { NavLink as RouterNavLink } from "react-router-dom";

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    // ...
  }
);
```
> **Analisis Logika**:
> - **Proxy Component**: Komponen ini bertindak sebagai perantara (proxy) untuk `RouterNavLink`. Logikanya adalah kita ingin menambahkan fitur baru (seperti `activeClassName`) tanpa kehilangan fitur bawaan dari React Router.
> - **forwardRef**: Menggunakan `forwardRef` agar komponen induk bisa mengakses elemen DOM link secara langsung (misalnya untuk keperluan animasi atau pengaturan fokus).

### 2. Logika State Visual (Active/Pending)
Menangani perubahan gaya tampilan secara otomatis berdasarkan rute URL saat ini.

```tsx
className={({ isActive, isPending }) =>
  cn(className, isActive && activeClassName, isPending && pendingClassName)
}
```
> **Analisis Logika**:
> - **Dynamic Classes**: React Router memberikan informasi `isActive` secara internal. Logikanya adalah: "Jika rute ini sedang aktif, tambahkan kelas `activeClassName` ke elemen ini".
> - **The `cn` Utility**: Kita menggunakan fungsi pembantu `cn` (classnames) untuk menggabungkan string kelas dengan bersih, menghindari duplikasi kelas CSS yang bisa merusak tampilan.

### 3. Pemisahan Props (Clean Code Logic)
Memastikan props yang dikirim tidak tumpang tindih.

```tsx
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  // ...
}
```
> **Analisis Logika**:
> - **Type Safety**: Menggunakan `Omit<NavLinkProps, "className">` secara logika berarti "ambil semua fitur NavLink standar, tapi buang definisi `className`-nya karena saya akan mendefinisikan ulang dengan cara saya sendiri". Ini mencegah konflik tipe data di TypeScript.

---

## 🎨 Ringkasan Fitur
1. **Intelligent Active State**: Link otomatis berubah warna atau gaya saat user berada di halaman tersebut.
2. **Pending Support**: Mendukung status transisi (ketika data sedang dimuat sebelum pindah halaman).
3. **Tailwind Ready**: Sangat mudah diintegrasikan dengan utility classes Tailwind.
4. **Reusable**: Bisa digunakan di Navbar, Sidebar, atau Footer dengan gaya yang berbeda-beda cukup melalui props.
