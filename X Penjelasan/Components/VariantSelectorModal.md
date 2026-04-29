# Bedah Kode: VariantSelectorModal.tsx

Dokumen ini menjelaskan struktur kode dan logika di balik Modal Pemilih Varian yang memungkinkan user memilih opsi tambahan (seperti ukuran atau rasa) sebelum memasukkan produk ke keranjang.

---

## 📂 Lokasi File
`src/components/VariantSelectorModal.tsx`

---

## 🚀 Bedah Kode & Penjelasan

### 1. State Initialization (Default Selection)
Menentukan varian mana yang terpilih secara otomatis saat modal dibuka.

```tsx
const [selectedVariant, setSelectedVariant] = useState<string | null>(
  product.variants && product.variants.length > 0 ? product.variants[0].id : null
);
```
> **Analisis Logika**:
> - **Pre-selection UX**: Secara logika, kita tidak ingin user melihat form kosong. Dengan mengambil `product.variants[0].id` sebagai state awal, kita memastikan sudah ada satu varian yang terpilih secara default, sehingga user bisa langsung mengklik "Tambah" jika tidak ingin mengubah opsi.

### 2. Logika Konfirmasi & Callback
Mengirim data varian terpilih kembali ke komponen induk.

```tsx
const handleConfirm = () => {
  if (product.variants && product.variants.length > 0) {
    const variant = product.variants.find((v) => v.id === selectedVariant);
    onConfirm(variant || null);
  }
  onOpenChange(false);
};
```
> **Analisis Logika**:
> - **Bridge Logic**: Modal ini bertindak sebagai perantara. Ia mencari objek varian lengkap berdasarkan `id` yang disimpan di state, lalu mengirimkannya melalui fungsi `onConfirm`. Setelah itu, modal menutup dirinya sendiri melalui `onOpenChange(false)`.

### 3. Komponen Radio Group (Selection UI)
Menggunakan sistem pilihan tunggal agar user tidak bingung.

```tsx
<RadioGroup value={selectedVariant || ""} onValueChange={setSelectedVariant}>
  {product.variants.map((variant) => (
    <div key={variant.id} className="... hover:bg-muted/50">
      <RadioGroupItem value={variant.id} id={variant.id} />
      <Label htmlFor={variant.id}> ... </Label>
    </div>
  ))}
</RadioGroup>
```
> **Analisis Logika**:
> - **Radio vs Checkbox**: Secara logika bisnis, varian produk bersifat eksklusif (pilih salah satu). Oleh karena itu, kita menggunakan `RadioGroup`.
> - **Interaction Area**: Seluruh baris div diberikan class `cursor-pointer` dan dihubungkan dengan `Label htmlFor`. Ini memperluas area klik, sehingga user tidak harus tepat mengklik lingkaran kecil radio button-nya.

### 4. Perhitungan Harga Dinamis
Menampilkan total harga yang berubah sesuai varian yang dipilih.

```tsx
<p className="font-display text-lg font-bold">
  {new Intl.NumberFormat("id-ID", ...).format(
    product.price + (selectedVariantPriceModifier || 0)
  )}
</p>
```
> **Analisis Logika**:
> - **Real-time Math**: Kita menjumlahkan harga dasar produk (`product.price`) dengan `priceModifier` dari varian terpilih. Logikanya adalah memberikan transparansi harga kepada user sebelum mereka melakukan pembelian, sehingga tidak ada "kejutan" harga saat di halaman keranjang.

---

## 🎨 Ringkasan Fitur
1. **Shadcn UI Integration**: Menggunakan komponen `Dialog` untuk efek modal yang halus dan aksesibel.
2. **Currency Localization**: Menggunakan `Intl.NumberFormat` untuk format Rupiah yang konsisten di seluruh aplikasi.
3. **Responsive Modal**: Menggunakan `sm:max-w-md` agar lebar modal tetap proporsional baik di layar HP maupun Desktop.
4. **Visual Preview**: Menampilkan thumbnail gambar produk di dalam modal untuk memperkuat memori visual user.
