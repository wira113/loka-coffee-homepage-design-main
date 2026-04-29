import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, LogOut, ShieldCheck, Edit2, X, Loader2, Camera, Package, ChevronRight, Coffee, Clock, User, Star, MessageSquarePlus, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Fungsi untuk mendapatkan inisial dari nama
const getInitials = (name: string): string => {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// Fungsi untuk generate warna background konsisten berdasarkan nama
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Komponen Avatar
const UserAvatar = ({ name, avatarUrl, preview }: { name: string; avatarUrl?: string; preview?: string }) => {
  const initials = getInitials(name || "?");
  const bgColor = getAvatarColor(name || "?");
  const imageUrl = preview || avatarUrl;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="h-24 w-24 rounded-2xl border-4 border-background object-cover shadow-sm"
      />
    );
  }

  return (
    <div
      className={`h-24 w-24 rounded-2xl ${bgColor} border-4 border-background flex items-center justify-center text-white shadow-sm`}
    >
      <span className="font-display text-3xl font-bold">{initials}</span>
    </div>
  );
};

const Profile = () => {
  const { user: authUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State untuk profile (menampung data yang dilengkapi dengan relasi orders)
  const [profile, setProfile] = useState<any>(authUser);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'reviews'>(
    searchParams.get('tab') === 'reviews' ? 'reviews' : 'profile'
  );
  
  // Review state
  const [reviewableProducts, setReviewableProducts] = useState<any[]>([]);
  const [reviewedProducts, setReviewedProducts] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [editForm, setEditForm] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    password: "",
    password_confirmation: "",
  });

  // Fetch dari endpoint /api/me untuk mendapatkan update profil & order
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("loka_token");
      if (!token) {
        setIsLoadingProfile(false);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setProfile(data.data);
            // Update edit form dari data terbaru
            setEditForm({
              name: data.data.name || "",
              email: data.data.email || "",
              phone: data.data.phone || "",
              password: "",
              password_confirmation: "",
            });
          }
        }
      } catch (error) {
        console.error("Gagal memuat profil profil API:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    if (authUser) {
      fetchProfileData();
    }
  }, [authUser]);

  // Fetch daftar produk yang bisa dan sudah direview
  const fetchReviewableProducts = async () => {
    const token = localStorage.getItem("loka_token");
    if (!token) return;
    setIsLoadingReviews(true);
    try {
      const res = await fetch(`${API_BASE_URL}/me/reviewable-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") {
          setReviewableProducts(data.data.reviewable || []);
          setReviewedProducts(data.data.reviewed || []);
        }
      }
    } catch (e) {
      console.error("Gagal memuat data review:", e);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (authUser && activeTab === 'reviews') {
      fetchReviewableProducts();
    }
  }, [authUser, activeTab]);

  const openReviewModal = (product: any) => {
    setSelectedReviewProduct(product);
    setReviewRating(5);
    setReviewComment("");
    setHoverRating(0);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("Komentar tidak boleh kosong.");
      return;
    }
    const token = localStorage.getItem("loka_token");
    if (!token || !selectedReviewProduct) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/catalog/products/${selectedReviewProduct.product_slug}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Ulasan berhasil dikirim!");
        setIsReviewModalOpen(false);
        fetchReviewableProducts(); // refresh list
      } else {
        toast.error(data.message || "Gagal mengirim ulasan.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, GIF, WebP).");
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error("Nama dan email tidak boleh kosong.");
      return;
    }

    if (!profile?.id) {
      toast.error("User ID tidak ditemukan.");
      return;
    }

    const token = localStorage.getItem("loka_token");
    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login ulang.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);
      formData.append("phone", editForm.phone);
      
      if (editForm.password) {
        formData.append("password", editForm.password);
        formData.append("password_confirmation", editForm.password_confirmation);
      }

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(`${API_BASE_URL}/me/update`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: formData,
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage = responseData?.message || responseData?.error || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      toast.success("✅ Profil berhasil diperbarui!");
      setIsEditOpen(false);
      setAvatarPreview(null);
      setAvatarFile(null);
      
      // Reset password fields
      setEditForm(prev => ({
        ...prev,
        password: "",
        password_confirmation: ""
      }));
      
      // Refresh data profil
      if (responseData.status === "success" && responseData.data) {
        const updatedUser = responseData.data;
        setProfile(updatedUser);
        updateUser({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role
        });
      } else {
        // Fallback jika response tidak menyertakan data user lengkap
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (err: any) {
      console.error("Edit profile error:", err);
      const errorMsg = err.message || "Terjadi kesalahan saat mengupdate profil.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authUser) {
    navigate("/login");
    return null;
  }

  // Gunakan data gabungan, default-nya authUser 
  const displayUser = profile || authUser;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="section-container flex-grow py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50 shadow-lg overflow-hidden">
            <div className="h-32 bg-primary/10 relative">
              <div className="absolute -bottom-12 left-8">
                <UserAvatar name={displayUser.name} avatarUrl={(displayUser as any)?.avatar_url} />
              </div>
            </div>
            
            <CardHeader className="pt-16 pb-6 px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-2xl font-bold">{displayUser.name}</CardTitle>
                  <CardDescription className="font-body text-sm mt-1 flex items-center gap-1.5 capitalize">
                    <ShieldCheck size={14} className="text-primary" />
                    {displayUser.role} Account
                  </CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={() => setIsEditOpen(true)} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-body font-medium"
                  >
                    <Edit2 size={16} />
                    Edit Profil
                  </Button>
                  <Button variant="outline" onClick={handleLogout} className="text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20 gap-2 font-body font-medium">
                    <LogOut size={16} />
                    Keluar
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="mt-6 flex gap-2 border-b border-border/30 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <User size={16} />
                  Informasi Profil
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Package size={16} />
                  Riwayat Pesanan ({profile?.orders?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Star size={16} />
                  Ulasan Saya
                </button>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8 space-y-6">
              {/* Tab: Informasi Profil */}
              {activeTab === 'profile' && (
              <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Mail size={12} />
                    Email
                  </span>
                  <p className="font-body text-sm font-medium text-foreground">{displayUser.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Phone size={12} />
                    Phone
                  </span>
                  <p className="font-body text-sm font-medium text-foreground">{displayUser.phone || "-"}</p>
                </div>
              </div>
              </div>
              )}

              {/* Tab: Riwayat Pesanan */}
              {activeTab === 'orders' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="text-primary" size={20} />
                  <h3 className="font-display text-lg font-bold">Riwayat Pesanan</h3>
                </div>
                
                {isLoadingProfile ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={24} className="animate-spin text-muted-foreground" />
                  </div>
                ) : profile?.orders && profile.orders.length > 0 ? (
                  <div className="space-y-3">
                    {profile.orders.map((order: any) => (
                      <button
                        key={order.id}
                        onClick={() => openOrderDetails(order)}
                        className="w-full text-left group relative overflow-hidden bg-gradient-to-br from-card to-card/80 rounded-xl border border-border/60 hover:border-primary/60 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] p-4 md:p-5"
                      >
                        {/* Background glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        
                        <div className="relative flex flex-col md:flex-row justify-between md:items-center gap-4">
                          {/* Left side - Order info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Coffee className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground text-base">Pesanan #{order.id}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock size={12} className="text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                    })} • {new Date(order.created_at).toLocaleTimeString('id-ID', {
                                      hour: '2-digit', minute: '2-digit'
                                    })} WIB
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Order type badge */}
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 bg-muted/50 rounded-md">
                                {order.order_type === 'dine_in' ? '🍽️ Dine In' : '📦 ' + (order.order_type || 'Order')}
                              </span>
                              <span className={`text-[10px] px-3 py-1 rounded-full font-bold tracking-wide uppercase transition-colors ${
                                order.payment_status === 'paid' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                                  : order.payment_status === 'expired'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                              }`}>
                                {order.payment_status === 'paid' ? '✓ Paid' : order.payment_status}
                              </span>
                            </div>
                          </div>

                          {/* Right side - Price and arrow */}
                          <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Total</p>
                              <p className="font-bold text-lg text-primary">
                                Rp {Number(order.grand_total).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/30 p-8 rounded-xl flex flex-col items-center justify-center text-center border border-border/40 border-dashed">
                    <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="font-medium text-foreground">Belum ada pesanan</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Pesan menu favorit Anda sekarang dan nikmati pengalaman terbaik dari Loka Coffee.
                    </p>
                  </div>
                )}
              </div>
              )}

              {/* Tab: Ulasan Saya */}
              {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="text-primary" size={20} />
                    <h3 className="font-display text-lg font-bold">Ulasan Saya</h3>
                  </div>
                </div>

                {isLoadingReviews ? (
                  <div className="flex justify-center py-10">
                    <Loader2 size={24} className="animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Belum Direview */}
                    {reviewableProducts.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                          <MessageSquarePlus size={14} />
                          Menunggu Ulasan ({reviewableProducts.length})
                        </p>
                        <div className="space-y-3">
                          {reviewableProducts.map((p) => (
                            <div
                              key={p.product_id}
                              className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors"
                            >
                              {p.product_image && (
                                <img
                                  src={p.product_image}
                                  alt={p.product_name}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground truncate">{p.product_name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Sudah dibeli, belum direview</p>
                              </div>
                              <Button
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 flex-shrink-0"
                                onClick={() => openReviewModal(p)}
                              >
                                <Star size={13} />
                                Review
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sudah Direview */}
                    {reviewedProducts.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          Sudah Direview ({reviewedProducts.length})
                        </p>
                        <div className="space-y-3">
                          {reviewedProducts.map((r) => (
                            <div
                              key={r.review_id}
                              className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-foreground">{r.product_name}</p>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={13}
                                      className={i < r.rating ? "fill-primary text-primary" : "text-border"}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground italic leading-relaxed">
                                "{r.comment}"
                              </p>
                              <p className="text-[10px] text-muted-foreground/60">
                                {new Date(r.created_at).toLocaleDateString('id-ID', {
                                  year: 'numeric', month: 'long', day: 'numeric'
                                })}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {reviewableProducts.length === 0 && reviewedProducts.length === 0 && (
                      <div className="bg-muted/30 p-8 rounded-xl flex flex-col items-center justify-center text-center border border-border/40 border-dashed">
                        <Star className="h-10 w-10 text-muted-foreground/30 mb-3" />
                        <p className="font-medium text-foreground">Belum ada produk untuk direview</p>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                          Beli produk favoritmu dan bagikan pengalamanmu kepada pelanggan lain.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              )}
            </CardContent>
          </Card>

          {/* Modal Edit Profil */}
          {isEditOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md border-border/50 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="font-display text-xl font-bold">Edit Profil</CardTitle>
                  <button
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditForm(prev => ({ ...prev, password: "", password_confirmation: "" }));
                      setAvatarPreview(null);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground block">Foto Profil</label>
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <UserAvatar 
                            name={editForm.name} 
                            avatarUrl={(displayUser as any)?.avatar_url}
                            preview={avatarPreview || undefined}
                          />
                          <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-md">
                            <Camera size={16} />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                              disabled={isLoading}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Klik ikon kamera untuk upload foto profil (Max 5MB)
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-4 mt-4"></div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Nama Lengkap</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Masukkan nama lengkap"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        placeholder="Masukkan email"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">No. Telepon (Opsional)</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        placeholder="Masukkan nomor telepon"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div className="border-t border-border/30 pt-4 mt-4">
                      <h4 className="text-sm font-bold text-foreground mb-3">Ganti Password (Opsional)</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground">Password Baru</label>
                          <input
                            type="password"
                            name="password"
                            value={editForm.password}
                            onChange={handleEditChange}
                            placeholder="Minimal 8 karakter"
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground">Konfirmasi Password Baru</label>
                          <input
                            type="password"
                            name="password_confirmation"
                            value={editForm.password_confirmation}
                            onChange={handleEditChange}
                            placeholder="Ulangi password baru"
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditOpen(false);
                          setEditForm(prev => ({ ...prev, password: "", password_confirmation: "" }));
                          setAvatarPreview(null);
                        }}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          "Simpan Perubahan"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Modal Review Produk */}
          {isReviewModalOpen && selectedReviewProduct && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <Card className="w-full max-w-md border-border/50 shadow-2xl">
                <CardHeader className="flex flex-row items-start justify-between pb-4">
                  <div>
                    <CardTitle className="font-display text-xl font-bold">Tulis Ulasan</CardTitle>
                    <CardDescription className="mt-1 font-medium text-primary">
                      {selectedReviewProduct.product_name}
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                  >
                    <X size={20} />
                  </button>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Star Rating */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            size={28}
                            className={`transition-colors ${
                              star <= (hoverRating || reviewRating)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-medium text-muted-foreground self-center">
                        {["" , "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus"][hoverRating || reviewRating]}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Komentar</label>
                    <Textarea
                      placeholder="Bagaimana pendapatmu tentang produk ini? Ceritakan pengalamanmu..."
                      className="min-h-[120px] text-sm resize-none"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      maxLength={1000}
                    />
                    <p className="text-[11px] text-muted-foreground text-right">
                      {reviewComment.length}/1000
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="flex-1"
                      disabled={isSubmittingReview}
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      disabled={isSubmittingReview || !reviewComment.trim()}
                      onClick={handleSubmitReview}
                    >
                      {isSubmittingReview ? (
                        <><Loader2 size={16} className="animate-spin" /> Mengirim...</>
                      ) : (
                        <><Star size={16} /> Kirim Ulasan</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Modal Order Details */}
          {isOrderDetailsOpen && selectedOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between pb-4 sticky top-0 bg-card border-b border-border/30">
                  <div>
                    <CardTitle className="font-display text-xl font-bold">Pesanan #{selectedOrder.id}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(selectedOrder.created_at).toLocaleDateString('id-ID', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })} • {new Date(selectedOrder.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit', minute: '2-digit'
                      })} WIB
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => setIsOrderDetailsOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={24} />
                  </button>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                  {/* Status and Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Status Pembayaran</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold tracking-wide uppercase ${
                          selectedOrder.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                            : selectedOrder.payment_status === 'expired'
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                        }`}>
                          {selectedOrder.payment_status === 'paid' ? '✓ Lunas' : selectedOrder.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Tipe Pesanan</p>
                      <p className="font-semibold text-foreground">
                        {selectedOrder.order_type === 'dine_in' ? '🍽️ Dine In' : '📦 ' + (selectedOrder.order_type || 'Order')}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-display font-bold text-lg mb-3">Item yang Dipesan</h3>
                    <div className="space-y-2 bg-muted/20 rounded-xl p-4 border border-border/30">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item: any, idx: number) => {
                          // Ambil harga total item dari berbagai kemungkinan field
                          const itemTotal = item.subtotal || item.amount || item.total_price || item.price || 0;
                          // Hitung harga per unit
                          const unitPrice = item.quantity > 0 ? itemTotal / item.quantity : 0;
                          
                          return (
                            <div key={idx} className="flex justify-between items-start py-3 border-b border-border/20 last:border-0">
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">{item.product_name || item.name || 'Item'}</p>
                                <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">
                                  Rp {Number(itemTotal).toLocaleString('id-ID')}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    Rp {Math.round(unitPrice).toLocaleString('id-ID')}/pcs
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground py-3">Tidak ada item</p>
                      )}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">
                        Rp {Number(selectedOrder.subtotal || selectedOrder.grand_total).toLocaleString('id-ID')}
                      </span>
                    </div>
                    {selectedOrder.tax > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pajak</span>
                        <span className="font-medium text-foreground">
                          Rp {Number(selectedOrder.tax).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Diskon</span>
                        <span className="font-medium text-red-600">
                          -Rp {Number(selectedOrder.discount).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-primary/20 pt-2 mt-2 flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-lg text-primary">
                        Rp {Number(selectedOrder.grand_total).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button
                    onClick={() => setIsOrderDetailsOpen(false)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Tutup
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
