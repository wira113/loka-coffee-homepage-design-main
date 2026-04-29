// Footer berisi informasi Loka Coffee dan tautan sosial
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-foreground">
    <div className="section-container grid gap-8 py-12 text-primary-foreground md:grid-cols-4 md:py-16">
      <div>
        <h3 className="font-display text-lg font-bold">Loka Coffee</h3>
        <p className="mt-2 font-body text-xs leading-relaxed text-primary-foreground/70">
          Kopi berkualitas untuk semua. Diracik dengan cinta dari biji kopi terbaik Nusantara.
        </p>
      </div>
      <div>
        <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">Menu</h4>
        <ul className="mt-3 space-y-2">
          {["Coffee", "Non-Coffee", "Makanan Ringan"].map((l) => (
            <li key={l}>
              <a href="#" className="font-body text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground">{l}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">Company</h4>
        <ul className="mt-3 space-y-2">
          {["About Us", "Blog", "Careers", "Contact"].map((l) => (
            <li key={l}>
              <a href="#" className="font-body text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground">{l}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">Follow Us</h4>
        <div className="mt-3 flex gap-3">
          {[Instagram, Facebook, Twitter].map((Icon, i) => (
            <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 py-4">
      <p className="text-center font-body text-xs text-primary-foreground/40">
        © 2026 Loka Coffee. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
