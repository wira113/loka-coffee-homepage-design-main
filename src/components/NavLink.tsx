// Komponen pembungkus untuk `react-router-dom/NavLink`.
// Tujuannya agar kompatibel dengan sistem kelas Tailwind kita melalui utilitas `cn`,
// serta mendukung kelas berbeda untuk kondisi aktif dan pending.
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Props tambahan:
// - activeClassName: kelas ketika link sedang aktif (route cocok dengan URL sekarang)
// - pendingClassName: kelas ketika route sedang dalam proses transisi
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          // `cn` akan menggabungkan kelas dasar dengan kelas aktif / pending jika kondisinya terpenuhi
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
