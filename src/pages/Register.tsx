import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import registerImage from "@/assets/halaman-about.png"; // Using a different but high quality image

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.password_confirmation) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan konfirmasi password sama dengan password Anda.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const res = await register(formData);

    if (res.success) {
      toast({
        title: "Registrasi Berhasil",
        description: "Selamat datang di Loka Coffee! Akun Anda telah dibuat.",
      });
      navigate("/"); // Redirect to home as they are auto-logged in
    } else {
      toast({
        title: "Registrasi Gagal",
        description: res.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Kiri: Form Register */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative min-h-screen">
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Link>
        
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Coffee size={22} />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                Loka Coffee
              </span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Daftar Akun Baru
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              Bergabunglah dengan komunitas Loka Coffee hari ini.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  className="font-body h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className="font-body h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input 
                  id="phone" 
                  placeholder="08123456789" 
                  required 
                  value={formData.phone}
                  onChange={handleChange}
                  className="font-body h-11"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    className="font-body h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Konfirmasi</Label>
                  <Input 
                    id="password_confirmation" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="font-body h-11"
                  />
                </div>
              </div>
            </div>
            
            <Button disabled={isLoading} type="submit" className="w-full h-11 font-body font-semibold text-base shadow-sm mt-2">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Daftar Sekarang"}
            </Button>
          </form>

          <div className="text-center md:text-left text-sm font-body text-muted-foreground pt-2">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>

      {/* Kanan: Gambar */}
      <div className="hidden md:block w-1/2 relative bg-muted border-l border-border/50">
        <div className="absolute inset-0 bg-primary/5 z-10 mix-blend-multiply"></div>
        <img 
          src={registerImage} 
          alt="Loka Coffee Experience" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent z-10 flex flex-col justify-end p-12 lg:p-16">
          <blockquote className="space-y-4 max-w-lg">
            <p className="font-display text-2xl font-medium text-foreground leading-snug">
              "Setiap cangkir kopi Loka adalah janji akan kualitas dan kenyamanan yang tak tertandingi."
            </p>
            <footer className="text-base font-body font-medium text-primary">
              — Premium Roastery & Kitchen
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Register;
