import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, CreditCard, Wallet, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Gunakan hook cart internal sebagai pengganti `react-use-cart`
import { useCart } from "react-use-cart";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const deliveryOptions = [
  { value: "dinein", label: "Makan di Tempat (Dine-in)", price: 0, description: "Nikmati kopi langsung di Loka Coffee" },
  { value: "takeaway", label: "Bawa Pulang (Takeaway)", price: 0, description: "Ambil pesanan di counter, siap dibawa pergi" },
  { value: "gosend", label: "Antar ke Lokasi (GoSend)", price: 15000, description: "Diantar ke alamat Anda via GoSend" },
];

// Denah tempat duduk: 3 baris (A-C), masing-masing 4 kursi
const SEAT_ROWS = ["A", "B", "C"];
const SEATS_PER_ROW = 4;

export default function Checkout() {
  const { items, cartTotal, isEmpty, emptyCart } = useCart();
  const { isAuthenticated, user: authUser, token } = useAuth();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [voucherState, setVoucherState] = useState({
    isValidating: false,
    message: "",
    isError: false,
    appliedCode: "",
  });

  const [formData, setFormData] = useState({
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    address: "",
    notes: "",
    delivery: "dinein",
    paymentMethod: "transfer",
    discountCode: "",
    discountAmount: 0,
  });

  const selectedDelivery = deliveryOptions.find((d) => d.value === formData.delivery);
  const shippingCost = selectedDelivery?.price ?? 0;

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subtotalBeforeDiscount = cartTotal;
  const discountAmount = formData.discountAmount;
  const subtotalAfterDiscount = Math.max(0, subtotalBeforeDiscount - discountAmount);
  const tax = subtotalAfterDiscount * 0.1;
  const grandTotal = subtotalAfterDiscount + tax + shippingCost;

  const handleApplyVoucher = async () => {
    if (!formData.discountCode.trim()) {
      setVoucherState({ ...voucherState, message: "Ketik kode voucher dulu", isError: true });
      return;
    }
    try {
      setVoucherState({ ...voucherState, isValidating: true, message: "Mengecek kode..." });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/voucher/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          code: formData.discountCode,
          order_total: subtotalBeforeDiscount
        })
      });
      const result = await response.json();
      if (response.ok && result.valid) {
        handleChange("discountAmount", result.discount_amount);
        setVoucherState({
          isValidating: false,
          isError: false,
          message: result.message,
          appliedCode: result.code
        });
      } else {
        handleChange("discountAmount", 0);
        setVoucherState({
          isValidating: false,
        isError: true,
          message: result.message || "Voucher tidak valid",
          appliedCode: ""
        });
      }
    } catch (error) {
      handleChange("discountAmount", 0);
      setVoucherState({
        isValidating: false,
        isError: true,
        message: "Terjadi kesalahan sistem saat mengecek voucher",
        appliedCode: ""
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      alert("Mohon lengkapi Email.");
      return;
    }

    if (!formData.phone) {
      alert("Mohon lengkapi Nomor Telepon.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const orderTypeMap: Record<string, string> = {
        dinein: "dine_in",
        takeaway: "take_away",
        gosend: "delivery"
      };

      let numericSeatId = null;
      if (selectedSeat) {
        const row = selectedSeat.charAt(0);
        const col = parseInt(selectedSeat.slice(1));
        const rowIndex = SEAT_ROWS.indexOf(row);
        if (rowIndex !== -1 && !isNaN(col)) {
          numericSeatId = (rowIndex * SEATS_PER_ROW) + col;
        }
      }

      const payload = {
        customer_email: formData.email,
        customer_phone: formData.phone,
        total_price: subtotalAfterDiscount,
        discount_amount: discountAmount,
        order_type: orderTypeMap[formData.delivery] || formData.delivery,
        seat_ids: numericSeatId ? [numericSeatId.toString()] : [],
        items: items.map(item => ({
          id: (item as any).productId || item.id,
          quantity: item.quantity,
          notes: formData.notes || "",
          price: item.price
        }))
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.payment_url) {
        if (emptyCart) emptyCart();
        window.location.href = result.payment_url;
      } else {
        alert(result.message || "Gagal membuat pesanan.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Terjadi kesalahan saat checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-container py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Keranjang Kosong</h1>
          <p className="text-muted-foreground mb-6">Tambahkan produk dulu sebelum checkout.</p>
          <Button asChild>
            <Link to="/products">Lihat Produk</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="section-container py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left — Shipping Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-foreground">Informasi Pemesan</h2>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.phone}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                {/* Alamat hanya ditampilkan jika memilih GoSend */}
                {formData.delivery === "gosend" && (
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Pengiriman (GoSend)</Label>
                    <textarea
                      id="address"
                      rows={3}
                      placeholder="Jl. Contoh No.123, RT/RW, Kelurahan, Kecamatan, Kota"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Pesanan (opsional)</Label>
                  <textarea
                    id="notes"
                    rows={2}
                    placeholder="Contoh: less sugar, no ice, extra shot…"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                  />
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground">Pilih Metode Pengambilan</h2>
                <RadioGroup
                  value={formData.delivery}
                  onValueChange={(val) => handleChange("delivery", val)}
                  className="space-y-3"
                >
                  {deliveryOptions.map((d) => (
                    <label
                      key={d.value}
                      className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${formData.delivery === d.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={d.value} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{d.label}</p>
                          <p className="text-xs text-muted-foreground">{d.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {d.price === 0 ? "Gratis" : formatPrice(d.price)}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Seat Picker — hanya untuk Dine-in */}
              {formData.delivery === "dinein" && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-lg font-bold text-foreground">Pilih Tempat Duduk</h2>
                  </div>

                  {/* Label area */}
                  <div className="flex items-center justify-center">
                    <div className="w-full max-w-xs bg-muted/50 rounded-md py-1.5 text-center text-xs font-medium text-muted-foreground tracking-widest uppercase">
                      ☕ Counter / Bar
                    </div>
                  </div>

                  {/* Grid kursi */}
                  <div className="space-y-3">
                    {SEAT_ROWS.map((row) => (
                      <div key={row} className="flex items-center gap-2 justify-center">
                        <span className="text-xs font-semibold text-muted-foreground w-4">{row}</span>
                        <div className="flex gap-2">
                          {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                            const seatId = `${row}${i + 1}`;
                            const isSelected = selectedSeat === seatId;
                            return (
                              <button
                                key={seatId}
                                type="button"
                                onClick={() => setSelectedSeat(isSelected ? null : seatId)}
                                className={`w-12 h-10 rounded-md text-xs font-semibold border transition-all duration-200 ${isSelected
                                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                    : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                                  }`}
                                title={`Kursi ${seatId}`}
                              >
                                {seatId}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Keterangan & status pilihan */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-3.5 h-3.5 rounded border border-border bg-background" />
                        Tersedia
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-3.5 h-3.5 rounded bg-primary" />
                        Dipilih
                      </span>
                    </div>
                    {selectedSeat ? (
                      <p className="text-xs font-medium text-primary">Kursi {selectedSeat} dipilih ✓</p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Belum memilih kursi</p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground">Metode Pembayaran</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("paymentMethod", "transfer")}
                    className={`flex items-center gap-3 border rounded-lg p-4 transition-colors ${formData.paymentMethod === "transfer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Transfer Bank</p>
                      <p className="text-xs text-muted-foreground">BCA, Mandiri, BNI</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("paymentMethod", "ewallet")}
                    className={`flex items-center gap-3 border rounded-lg p-4 transition-colors ${formData.paymentMethod === "ewallet"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    <Wallet className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">E-Wallet</p>
                      <p className="text-xs text-muted-foreground">GoPay, OVO, Dana</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right — Order Review */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-5">
                <h2 className="font-display text-lg font-bold text-foreground">Ringkasan Pesanan</h2>

                {/* Mini cart */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        {/* Gambar kecil produk di ringkasan checkout */}
                        {typeof (item as any).image === "string" &&
                          (((item as any).image as string).startsWith("/") ||
                            ((item as any).image as string).startsWith("http")) ? (
                          <img
                            src={(item as any).image as string}
                            alt={item.name}
                            className="h-10 w-10 rounded flex-shrink-0 object-cover"
                          />
                        ) : (
                          <div
                            className={`h-10 w-10 rounded flex-shrink-0 ${(item as any).image ?? "bg-muted"}`}
                          />
                        )}
                        <div>
                          <p className="text-foreground font-medium text-xs">{item.name}</p>
                          <p className="text-muted-foreground text-xs">x{item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-foreground font-medium text-xs">
                        {formatPrice(item.price * (item.quantity ?? 1))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotalBeforeDiscount)}</span>
                  </div>
                  
                  {/* Discount Input */}
                  <div className="space-y-2 bg-muted/30 p-3 rounded-md border border-border/50">
                    <Label htmlFor="discountCode" className="text-xs font-semibold">Kode Diskon</Label>
                    <div className="flex gap-2">
                        <Input
                          id="discountCode"
                          type="text"
                          placeholder="Masukkan kode diskon"
                          value={formData.discountCode}
                          onChange={(e) => {
                            handleChange("discountCode", e.target.value);
                            if (voucherState.appliedCode && e.target.value !== voucherState.appliedCode) {
                                // Reset diskon jika user mengetik kode lain
                                handleChange("discountAmount", 0);
                                setVoucherState((prev) => ({ ...prev, appliedCode: "", message: "", isError: false }));
                            }
                          }}
                          className="text-xs flex-1"
                          disabled={voucherState.isValidating}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleApplyVoucher}
                          disabled={voucherState.isValidating || !formData.discountCode}
                        >
                          Terapkan
                        </Button>
                    </div>
                    {voucherState.message && (
                        <p className={`text-[10px] pr-2 font-medium ${voucherState.isError ? "text-red-500" : "text-green-600"}`}>
                            {voucherState.message}
                        </p>
                    )}
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-muted-foreground bg-red-50 dark:bg-red-950/20 p-2 rounded">
                      <span className="font-medium">Diskon</span>
                      <span className="text-red-600 dark:text-red-400 font-semibold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-muted-foreground pt-2">
                    <span>Subtotal Setelah Diskon</span>
                    <span className="text-foreground font-medium">{formatPrice(subtotalAfterDiscount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pajak (10%)</span>
                    <span className="text-foreground">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{selectedDelivery?.value === "gosend" ? "Ongkir GoSend" : "Layanan Pengambilan"}</span>
                    <span className="text-foreground">{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Grand Total</span>
                    <span className="font-bold text-foreground text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Memproses..." : "Buat Pesanan"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
