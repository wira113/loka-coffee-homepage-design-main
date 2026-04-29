import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Gunakan hook cart internal sebagai pengganti `react-use-cart`
import { useCart } from "react-use-cart";
import { useAuth } from "@/context/AuthContext";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function Cart() {
  const { items, isEmpty, totalUniqueItems, cartTotal, updateItemQuantity, removeItem, emptyCart } = useCart();
  const { isAuthenticated } = useAuth();

  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + tax;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="section-container py-8 md:py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Keranjang Belanja</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {totalUniqueItems} item di keranjang
        </p>

        {isEmpty ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Keranjang Kosong</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Belum ada item di keranjang kamu. Yuk mulai belanja dan temukan produk favorit!
            </p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Mulai Belanja
              </Link>
            </Button>
          </div>
        ) : (
          /* ── Cart Content ── */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column — Item List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Table Header (desktop) */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-3 px-4">
                <span className="col-span-5">Produk</span>
                <span className="col-span-3 text-center">Jumlah</span>
                <span className="col-span-3 text-right">Subtotal</span>
                <span className="col-span-1" />
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-card border border-border rounded-lg p-4"
                >
                  {/* Product Info */}
                  <div className="md:col-span-5 flex items-center gap-4">
                    {/* Tampilkan gambar produk jika `image` adalah path/URL,
                        jika tidak, gunakan warna background sebagai placeholder. */}
                    {typeof (item as any).image === "string" &&
                      (((item as any).image as string).startsWith("/") ||
                        ((item as any).image as string).startsWith("http")) ? (
                      <img
                        src={(item as any).image as string}
                        alt={item.name}
                        className="h-20 w-20 rounded-md flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div
                        className={`h-20 w-20 rounded-md flex-shrink-0 ${(item as any).image ?? "bg-muted"}`}
                      />
                    )}
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-base">{item.name}</h3>
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                        {/* @ts-ignore */}
                        {item.variant && (
                          <p className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-sm w-fit">Varian: {item.variant} </p>
                        )}
                        {/* @ts-ignore */}
                        {item.toppings && (
                          <p className="text-xs text-muted-foreground italic">Topping: {item.toppings}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="md:col-span-3 flex items-center justify-center">
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        className="p-2 hover:bg-muted transition-colors"
                        onClick={() => {
                          const currentQty = item.quantity ?? 1;
                          const nextQty = currentQty - 1;
                          if (nextQty <= 0) {
                            removeItem(item.id);
                          } else {
                            updateItemQuantity(item.id, nextQty);
                          }
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        className="p-2 hover:bg-muted transition-colors"
                        onClick={() => {
                          const currentQty = item.quantity ?? 1;
                          updateItemQuantity(item.id, currentQty + 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="md:col-span-3 text-right">
                    <p className="font-semibold text-foreground text-sm">
                      {formatPrice(item.price * (item.quantity ?? 1))}
                    </p>
                  </div>

                  {/* Remove */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() => {
                        removeItem(item.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" asChild>
                  <Link to="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Lanjut Belanja
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => {
                    emptyCart();
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Kosongkan Keranjang
                </Button>
              </div>
            </div>

            {/* Right Column — Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground">Ringkasan Pesanan</h2>

                <div className="space-y-2 border-b border-border pb-4">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate max-w-[150px]">
                        {item.name} {item.variant ? `- ${item.variant}` : ''}
                      </span>
                      <span className="font-medium">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pajak (10%)</span>
                    <span className="text-foreground font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-foreground text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  {isAuthenticated ? (
                    <Link to="/checkout">Lanjut ke Checkout</Link>
                  ) : (
                    <Link to="/login">Login untuk Checkout</Link>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
