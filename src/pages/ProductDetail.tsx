import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Check, Minus, Plus, ShoppingCart, ChevronRight, Loader2, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "react-use-cart";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedToppings, setSelectedToppings] = useState<any[]>([]);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/catalog/products/${slug}`);
        if (!response.ok) throw new Error("Produk tidak ditemukan");
        
        const result = await response.json();
        if (result.status === "success") {
          const p = result.data;
          setProduct({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: parseFloat(p.base_price),
            category: p.category?.name || "Uncategorized",
            description: p.description || "",
            rating: 4.8, // Fallback
            isAvailable: p.availability?.is_available,
            images: p.all_images.length > 0 ? p.all_images.map((img: any) => img.url) : ["/placeholder.jpg"],
            variants: p.variants || [],
            toppings: p.toppings || [],
            reviews: p.reviews || [],
            averageRating: p.average_rating || 0,
            totalReviews: p.total_reviews || 0
          });
        }
      } catch (err: any) {
        console.error("Fetch product detail error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-container py-20 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Memuat detail produk...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="section-container py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Produk tidak ditemukan</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Link to="/products" className="text-primary underline mt-4 inline-block">
            Kembali ke produk
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const features = ["Bahan premium berkualitas tinggi", "Proses produksi higienis", "Tanpa bahan pengawet", "Freshly prepared setiap hari"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="section-container py-8 md:py-12">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedThumb]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${selectedThumb === i ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.averageRating || 4.8) ? "fill-primary text-primary" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.averageRating || "4.8"}) • {product.totalReviews || 0} Reviews</span>
            </div>

            <p className="text-2xl font-bold text-foreground">
              {formatPrice(
                (product.price + (selectedVariant?.price_adjustment || 0) + selectedToppings.reduce((acc, t) => acc + t.base_price, 0))
              )}
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>

            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Varian / Size Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-foreground">Pilih Varian</h3>
                <RadioGroup 
                  value={String(selectedVariant?.id)} 
                  onValueChange={(val) => {
                    const variant = product.variants.find((v: any) => String(v.id) === val);
                    setSelectedVariant(variant);
                  }}
                  className="flex flex-wrap gap-3"
                >
                  {product.variants.map((v: any) => (
                    <div key={v.id} className="flex">
                      <RadioGroupItem value={String(v.id)} id={`v-${v.id}`} className="sr-only" />
                      <Label
                        htmlFor={`v-${v.id}`}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all
                          ${selectedVariant?.id === v.id 
                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                            : "bg-background text-foreground border-border hover:border-primary/50"}
                          text-xs font-medium 
                          ${!v.is_available ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                      >
                        <span>{v.name}</span>
                        {v.price_adjustment > 0 && (
                          <span className={`text-[10px] ${selectedVariant?.id === v.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            (+{v.price_adjustment/1000}k)
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Toppings Selection */}
            {product.toppings && product.toppings.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-foreground">Pilih Topping (Opsional)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.toppings.map((t: any) => (
                    <div key={t.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id={`t-${t.id}`} 
                        checked={selectedToppings.some(st => st.id === t.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedToppings([...selectedToppings, t]);
                          } else {
                            setSelectedToppings(selectedToppings.filter(st => st.id !== t.id));
                          }
                        }}
                      />
                      <Label htmlFor={`t-${t.id}`} className="text-xs flex justify-between flex-1 cursor-pointer">
                        <span>{t.name}</span>
                        <span className="text-muted-foreground">+{t.base_price/1000}k</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-muted transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-muted transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                className="flex-1 bg-primary text-primary-foreground"
                disabled={!product.isAvailable}
                onClick={() => {
                  if (product.variants && product.variants.length > 0 && !selectedVariant) {
                    toast.error("Silakan pilih varian terlebih dahulu!");
                    return;
                  }

                  const totalPrice = (product.price + (selectedVariant?.price_adjustment || 0) + selectedToppings.reduce((acc, t) => acc + t.base_price, 0));
                  
                  // Create a unique ID based on selections
                  const configId = [
                    product.id,
                    selectedVariant?.id || 'base',
                    ...selectedToppings.map(t => t.id).sort()
                  ].join('-');

                  addItem({
                    id: configId,
                    productId: product.id, // original product id
                    name: product.name,
                    price: totalPrice,
                    image: product.images[0],
                    // @ts-ignore
                    variant: selectedVariant?.name,
                    toppings: selectedToppings.map(t => t.name).join(', ')
                  }, qty);
                  toast.success(`${product.name} ditambahkan`);
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.isAvailable ? `Add to Cart - ${formatPrice((product.price + (selectedVariant?.price_adjustment || 0) + selectedToppings.reduce((acc, t) => acc + t.base_price, 0)) * qty)}` : "Stok Habis"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.totalReviews || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {product.description || `${product.name} adalah produk andalan kami yang dibuat dengan standar kualitas terbaik.`}
              </p>
            </TabsContent>
            <TabsContent value="specs" className="pt-6">
              <div className="grid grid-cols-2 gap-4 max-w-md text-sm">
                <span className="text-muted-foreground">Kategori</span>
                <span className="font-medium">{product.category}</span>
                <span className="text-muted-foreground">Ketersediaan</span>
                <span className={product.isAvailable ? "text-green-600" : "text-destructive"}>
                  {product.isAvailable ? "Tersedia" : "Stok Habis"}
                </span>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <div className="grid lg:grid-cols-3 gap-10">
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rv: any) => (
                      <div key={rv.id} className="border-b border-border pb-6 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-foreground">{rv.user_name}</p>
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < rv.rating ? "fill-primary text-primary" : "text-border"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase">{rv.created_at}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{rv.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground text-sm">Belum ada ulasan untuk produk ini.</p>
                    </div>
                  )}
                </div>

                {/* Write Review — Notice Card */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 h-fit space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/15 rounded-lg">
                      <MessageSquarePlus className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-foreground">Tulis Ulasan</h3>
                  </div>

                  {isAuthenticated ? (
                    <>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Sudah mencoba produk ini? Bagikan pengalamanmu! Kamu hanya bisa mereview produk yang sudah pernah kamu beli.
                      </p>
                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                        <Link to="/profile?tab=reviews">
                          <MessageSquarePlus className="h-4 w-4" />
                          Tulis Ulasan di Profil
                        </Link>
                      </Button>
                      <p className="text-[11px] text-center text-muted-foreground">
                        Ulasan tersedia di tab <span className="font-semibold text-primary">Ulasan Saya</span> pada halaman profil.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Login terlebih dahulu untuk dapat memberikan ulasan produk yang sudah kamu beli.
                      </p>
                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link to="/login">Login Sekarang</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
