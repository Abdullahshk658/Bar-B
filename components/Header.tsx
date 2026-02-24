"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCartStore } from "@/store/cartStore";

const links = [
  { href: "/", label: "Home" },
  { href: "/bridal", label: "Bridal" },
  { href: "/cosmetics", label: "Cosmetics" },
  { href: "/dashboard", label: "Dashboard" }
];

export const Header = () => {
  const pathname = usePathname();
  const count = useCartStore((state) => state.cartCount());

  return (
    <header className="sticky top-0 z-40 border-b border-champagne/45 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="font-serif text-xl font-semibold tracking-wide sm:text-2xl">
          Bridal3D & Glow
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition sm:text-sm ${
                  active ? "bg-charcoal text-ivory" : "text-charcoal/80 hover:bg-champagne/35"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="ml-2 rounded-full bg-charcoal px-3 py-1 text-xs font-medium text-ivory sm:text-sm">
            Cart {count}
          </span>
        </nav>
      </div>
    </header>
  );
};
