import Image from "next/image";
import Link from "next/link";

import { toCurrency } from "@/lib/rental";
import type { Product } from "@/lib/types";

export const ProductCard = ({ product, href }: { product: Product; href?: string }) => {
  const productHref = href ?? `/bridal/${product.id}`;

  return (
    <article className="glass-card group overflow-hidden rounded-2xl shadow-luxe transition hover:-translate-y-1">
      <div className="relative h-56 w-full">
        <Image src={product.heroImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        {product.category === "Cosmetic" ? (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal px-3 py-1 text-xs text-ivory">Imported</span>
        ) : null}
      </div>
      <div className="space-y-3 p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60">{product.category}</p>
        <h3 className="font-serif text-2xl leading-tight">{product.name}</h3>
        <p className="text-sm text-charcoal/70">{product.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {product.price_sale ? <span className="rounded-full bg-white px-3 py-1">Buy {toCurrency(product.price_sale)}</span> : null}
          {product.price_rent ? <span className="rounded-full bg-champagne/45 px-3 py-1">Rent {toCurrency(product.price_rent)}</span> : null}
        </div>
        <Link href={productHref} className="inline-flex rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-ivory">
          {product.category === "Bridal" ? "View 3D Detail" : "Shop Now"}
        </Link>
      </div>
    </article>
  );
};
