# Bedah Kode: Login.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik halaman Login pada proyek Loka Coffee secara mendalam.

---

## 📂 Lokasi File
`src/pages/Login.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. Import & State Management
Halaman ini menggunakan beberapa komponen UI kustom (Shadcn UI) dan mengelola status input pengguna.

```tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
```
> **Analisis Logika**:
> - **Input Binding**: Menggunakan teknik *Controlled Components* di mana nilai `Input` diikat langsung ke state (`email`, `password`). Setiap ketukan tombol memicu render ulang yang sinkron agar state selalu valid.
> - **`isLoading` (State Flow)**: 
>   - **Kegunaan**: Mengelola status pengiriman data ke server.
>   - **Logic**: State ini diatur menjadi `true` sesaat setelah tombol diklik. Logikanya adalah memblokir input user dan menonaktifkan tombol (`disabled={isLoading}`) agar tidak terjadi pengiriman data berkali-kali ke server (*double submission*).
>   - **Feedback Visual**: Saat `true`, teks "Masuk" diganti dengan ikon `Loader2` yang berputar (`animate-spin`), memberikan kepastian visual kepada user bahwa sistem sedang bekerja.
>   - **Cleanup**: State ini dikembalikan ke `false` baik login berhasil maupun gagal, agar form bisa digunakan kembali.

### 2. Logika Submit (Handle Login)
Fungsi ini menangani pengiriman data ke server dan memberikan feedback kepada pengguna.

```tsx
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await login({ email, password });

    if (res.success) {
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali di Loka Coffee!",
      });
      navigate("/");
    } else {
      toast({
        title: "Login Gagal",
        description: res.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };
```
> **Analisis Logika**:
> - **Asynchronous Flow**: Fungsi ini menggunakan `async/await` karena proses `login` melibatkan permintaan jaringan (network request) yang memakan waktu. Kita harus menunggu hasil dari server sebelum memutuskan langkah navigasi selanjutnya.
> - **Result Handling**: Objek `res` berisi boolean `success`. Jika `true`, logika aplikasi mengasumsikan token sudah tersimpan (melalui `AuthContext`), sehingga aman untuk melakukan `navigate("/")`.
> - **Error Management**: Jika login gagal, pesan error dari server (`res.message`) ditampilkan melalui komponen `Toast` dengan varian `destructive` (warna merah) sebagai peringatan keras bagi user.

### 3. Layout Responsif (Split Screen)
Halaman login menggunakan desain layar terbagi (*split screen*) yang modern.

```tsx
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Kiri: Form Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12">
        {/* Form konten di sini... */}
      </div>

      {/* Kanan: Gambar & Quote (Hanya muncul di Desktop) */}
      <div className="hidden md:block w-1/2 relative bg-muted">
        <img src={loginImage} className="..." />
        <div className="absolute inset-0 bg-gradient-to-t ... flex flex-col justify-end p-16">
          <blockquote className="...">
            <p className="font-display text-2xl ...">
              "Kopi kami bukan hanya sekadar minuman..."
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
```
> **Analisis Logika**:
> - **Layout Hierarchy**: Menggunakan kombinasi `w-full md:w-1/2`. Secara logika, pada layar mobile form akan memenuhi lebar layar (100%), dan pada desktop form hanya mengambil setengah (50%) untuk memberikan ruang bagi elemen dekoratif.
> - **Visual Anchor**: Sisi kanan (gambar) berfungsi sebagai *anchor* visual untuk memperkuat identitas brand. Penggunaan `absolute inset-0` pada gradient overlay memastikan teks quote selalu kontras dan mudah dibaca di atas gambar.

---

## 🎨 Ringkasan Fitur
1. **Validation**: Form mewajibkan email dan password (`required`).
2. **Interactive Loading**: Tombol "Masuk" yang berubah secara dinamis sesuai status proses.
3. **UX Focus**: Navigasi yang intuitif dengan tombol kembali dan link registrasi.
4. **Premium Design**: Tipografi elegan dan citra visual berkualitas tinggi yang mendukung *user engagement*.
