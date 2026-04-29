// Import gambar produk untuk digunakan di seluruh aplikasi.
// Simpan file `espresso.webp` di folder `src/assets`.
import espresso from "../assets/espresso.webp";
// Simpan file `cappucino.webp` di folder `src/assets`.
import cappucino from "../assets/cappucino.webp";
// Simpan file `matcha-latte.png` di folder `src/assets`.
import matchalatte from "../assets/matcha-latte.png";
// Gambar khusus untuk produk Croissant Butter.
// Simpan file `croissant-butter.png` di folder `src/assets`.
import croissantButter from "../assets/croissant-butter.png";
// Gambar khusus untuk produk Latte Caramel.
// Simpan file `latte-caramel.png` di folder `src/assets`.
import latteCaramel from "../assets/latte-caramel.png";
// Simpan file `ChocolateCake.png` di folder `src/assets`.
import chocolateCake from "../assets/ChocolateCake.png";
// Simpan file `TaroSmoothie.png` di folder `src/assets`.
import taroSmoothie from "../assets/TaroSmoothie.png";
// Simpan file `BananaBread.png` di folder `src/assets`.
import bananaBread from "../assets/Banana-Bread.png";
// Simpan file `lokaCoffeeBandung.png` di folder `src/assets`.
import blog1 from "../assets/blog-1.png";
import blog2 from "../assets/Loka-Bandung.png";
import blog3 from "../assets/review-kopi.png";
import blog4 from "../assets/Blog4.png";

// definisi tipe data produk yang digunakan seluruh aplikasi
export interface ProductVariant {
  id: string;
  name: string;
  priceModifier?: number; // harga tambahan untuk variant ini
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  description: string;
  image: string;
  isFeatured: boolean;
  isBestseller: boolean;
  variants?: ProductVariant[];
}

export interface Blog {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

export const categories = ["Coffee", "Non-Coffee", "Makanan Ringan"] as const;

export const products: Product[] = [
  { id: 1, name: "Espresso Classico", price: 28000, category: "Coffee", rating: 4.8, description: "Espresso klasik dengan rasa kopi yang kuat dan pahit. Cocok untuk pecinta kopi murni tanpa campuran susu.", image: espresso, isFeatured: true, isBestseller: true, variants: [{ id: "hot", name: "Hot" }, { id: "iced", name: "Iced" }] },
  { id: 2, name: "Cappuccino Loka", price: 35000, category: "Coffee", rating: 4.9, description: "Signature drink menggunakan biji Arabica Toraja, susu steamed, dan microfoam lembut. Kombinasi kopi dan susu yang seimbang.", image: cappucino, isFeatured: true, isBestseller: false, variants: [{ id: "hot", name: "Hot" }, { id: "iced", name: "Iced" }] },
  { id: 3, name: "Matcha Latte", price: 38000, category: "Non-Coffee", rating: 4.7, description: "Matcha premium dari Jepang dicampur susu segar. Rasa manis dan earthy dengan tekstur creamy.", image: matchalatte, isFeatured: true, isBestseller: false, variants: [{ id: "hot", name: "Hot" }, { id: "iced", name: "Iced" }] },
  { id: 4, name: "Croissant Butter", price: 25000, category: "Makanan Ringan", rating: 4.6, description: "Croissant renyah dengan isian mentega premium. Pas dinikmati dengan espresso atau cappuccino.", image: croissantButter, isFeatured: true, isBestseller: true },
  { id: 5, name: "Latte Caramel", price: 40000, category: "Coffee", rating: 4.5, description: "Latte dengan sirup caramel. Rasa manis dan creamy yang populer di kalangan pemula kopi.", image: latteCaramel, isFeatured: false, isBestseller: true, variants: [{ id: "hot", name: "Hot" }, { id: "iced", name: "Iced" }] },
  { id: 6, name: "Chocolate Cake", price: 32000, category: "Makanan Ringan", rating: 4.8, description: "Kue cokelat lembap dengan lapisan ganache. Manis dan cocok dipasangkan dengan kopi hitam.", image: chocolateCake, isFeatured: false, isBestseller: false },
  { id: 7, name: "Taro Smoothie", price: 36000, category: "Non-Coffee", rating: 4.4, description: "Smoothie ubi ungu dengan susu dan es. Rasa manis alami dan tekstur halus.", image: taroSmoothie, isFeatured: false, isBestseller: false, variants: [{ id: "regular", name: "Regular" }, { id: "extra-taro", name: "Extra Taro", priceModifier: 5000 }] },
  { id: 8, name: "Banana Bread", price: 22000, category: "Makanan Ringan", rating: 4.7, description: "Roti pisang homemade lembut dengan potongan pisang. Sangat cocok dengan latte atau matcha.", image: bananaBread, isFeatured: false, isBestseller: true },
];

export const blogs: Blog[] = [
  {
    id: 1,
    title: "5 Tips Menikmati Kopi Seperti Barista Profesional",
    category: "Tips",
    author: "Loka Team",
    date: "Feb 10, 2026",
    image: blog1,
    excerpt: "Pelajari cara menyeduh dan menikmati kopi layaknya barista handal dengan tips sederhana ini.",
    content: "Menikmati kopi bukan hanya soal rasa, tapi juga pengalaman. Mulai dari memilih biji kopi yang tepat, mengatur suhu air, hingga teknik penuangan yang benar — semua detail kecil ini membuat perbedaan besar pada cangkir kopi Anda. Dalam artikel ini, kami membagikan lima tips praktis yang bisa langsung Anda terapkan di rumah.",
  },
  {
    id: 2,
    title: "Loka Coffee Buka Cabang Baru di Bandung",
    category: "News",
    author: "Admin",
    date: "Jan 25, 2026",
    image: blog2,
    excerpt: "Kabar gembira untuk pencinta kopi Bandung! Loka Coffee hadir dengan konsep baru yang lebih cozy.",
    content: "Setelah sukses di Jakarta, Loka Coffee resmi membuka cabang pertamanya di Bandung dengan konsep industrial-meets-nature. Outlet baru ini mengusung desain interior yang memadukan elemen kayu alami dengan sentuhan modern, menciptakan suasana yang sempurna untuk bekerja maupun bersantai.",
  },
  {
    id: 3,
    title: "Review: Cappuccino Loka — Signature Drink Terfavorit",
    category: "Review",
    author: "Kopi Lovers",
    date: "Jan 12, 2026",
    image: blog3,
    excerpt: "Cappuccino Loka menjadi minuman favorit pelanggan setia kami. Apa rahasianya?",
    content: "Cappuccino Loka menggunakan biji Arabica single-origin dari Toraja yang di-roast medium untuk menghasilkan rasa yang seimbang antara manis, asam, dan pahit. Dikombinasikan dengan susu segar dan teknik steaming yang sempurna, minuman ini menghadirkan tekstur microfoam yang lembut di setiap tegukan.",
  },
  {
    id: 4,
    title: "Makanan Ringan yang Cocok Ditemani Kopi",
    category: "Tips",
    author: "Chef Loka",
    date: "Dec 28, 2025",
    image: blog4,
    excerpt: "Kopi dan makanan ringan adalah pasangan sempurna. Berikut rekomendasi kami.",
    content: "Tidak semua makanan ringan cocok dengan semua jenis kopi. Croissant butter misalnya, sangat pas dengan espresso karena rasa menteganya yang kaya menyeimbangkan kepahitan kopi. Sementara banana bread lebih cocok dinikmati dengan latte yang creamy. Di Loka Coffee, kami menyajikan berbagai pilihan snack yang sudah di-pairing dengan menu kopi kami.",
  },
];

export const testimonials = [
  { id: 1, name: "Rina Sari", role: "Coffee Enthusiast", text: "Kopi di Loka Coffee selalu konsisten enaknya. Tempatnya juga nyaman banget buat kerja!", rating: 5 },
  { id: 2, name: "Andi Pratama", role: "Freelancer", text: "Croissant dan cappuccino-nya jadi ritual pagi saya setiap hari. Highly recommended!", rating: 5 },
  { id: 3, name: "Maya Dewi", role: "Content Creator", text: "Suasana estetik, kopi berkualitas, dan harga bersahabat. Tempat favorit saya!", rating: 5 },
];
