import { useState } from "react";
import { Link } from "react-router-dom";
import { Coffee, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import loginImage from "@/assets/hero-coffee.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Kiri: Form Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative min-h-screen">
        {/* Tombol kembali */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Link>
        
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Logo & Judul */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Coffee size={22} />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                Loka Coffee
              </span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              Masukkan email dan password untuk mengakses akun Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-foreground">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-body h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-body h-11"
                />
              </div>
            </div>
            
            <Button disabled={isLoading} type="submit" className="w-full h-11 font-body font-semibold text-base shadow-sm">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Masuk"}
            </Button>
          </form>

          {/* Registrasi */}
          <div className="text-center md:text-left text-sm font-body text-muted-foreground pt-4">
            Belum punya akun?{" "}
            <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* Kanan: Gambar */}
      <div className="hidden md:block w-1/2 relative bg-muted border-l border-border/50">
        <div className="absolute inset-0 bg-primary/5 z-10 mix-blend-multiply"></div>
        <img 
          src={loginImage} 
          alt="Loka Coffee Atmosphere" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent z-10 flex flex-col justify-end p-12 lg:p-16">
          <blockquote className="space-y-4 max-w-lg">
            <div className="text-primary opacity-80 h-10 w-10">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="font-display text-2xl font-medium text-foreground leading-snug">
              Kopi kami bukan hanya sekadar minuman, tapi sebuah perjalanan menemukan harmoni dalam setiap teguknya.
            </p>
            <footer className="text-base font-body font-medium text-primary">
              — Loka Coffee Team
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Login;
