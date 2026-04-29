import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "react-use-cart";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Booking", href: "/booking" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const { totalUniqueItems, items } = useCart();
  const { setSearchQuery } = useShop();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Hitung total quantity dari semua item (bukan hanya unique items)
  const totalCartItems = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  // Fokus otomatis ke input saat search bar terbuka
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setLocalQuery("");
      setSearchQuery("");
    } else {
      setSearchOpen(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = localQuery.trim();
    setSearchQuery(q);
    if (q) {
      navigate("/products");
    }
    setSearchOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="section-container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl flex-shrink-0">
          Loka Coffee
        </Link>

        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 max-w-md">
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={handleSearchChange}
              placeholder="Cari produk..."
              className="flex-1 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button type="submit" className="rounded-full p-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Search size={16} />
            </button>
            <button type="button" onClick={handleSearchToggle} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          </form>
        ) : (
          <>
            <ul className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="font-body text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <button onClick={handleSearchToggle} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Search size={20} />
              </button>
              
              <Link 
                to={isAuthenticated ? "/profile" : "/login"}
                aria-label="Account" 
                className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex relative"
              >
                <User size={20} className={isAuthenticated ? "text-primary" : ""} />
                {isAuthenticated && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary border border-background shadow-sm" />
                )}
              </Link>

              <Link to="/cart" className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <ShoppingCart size={20} />
                {totalCartItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        )}
      </div>

      {mobileOpen && !searchOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="section-container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="block rounded-md px-3 py-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Added Login/Profile link for mobile */}
            <li>
              <Link 
                to={isAuthenticated ? "/profile" : "/login"} 
                className="block rounded-md px-3 py-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {isAuthenticated ? "Profil Saya" : "Masuk Akun"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
