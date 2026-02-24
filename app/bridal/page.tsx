"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";

const silhouetteOptions = ["All", "A-Line", "Mermaid", "Ball Gown", "Sheath"] as const;
const fabricOptions = ["All", "Lace", "Satin", "Tulle", "Organza"] as const;

export default function BridalCatalogPage() {
  const [silhouette, setSilhouette] = useState<(typeof silhouetteOptions)[number]>("All");
  const [fabric, setFabric] = useState<(typeof fabricOptions)[number]>("All");
  const [rentOnly, setRentOnly] = useState(false);

  const bridalProducts = useMemo(() => {
    return products
      .filter((product) => product.category === "Bridal")
      .filter((product) => (silhouette === "All" ? true : product.silhouette === silhouette))
      .filter((product) => (fabric === "All" ? true : product.fabric === fabric))
      .filter((product) => (rentOnly ? Boolean(product.price_rent) : true));
  }, [fabric, rentOnly, silhouette]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">Bridal Catalog</p>
        <h1 className="font-serif text-4xl sm:text-5xl">Couture Dresses</h1>
        <p className="max-w-2xl text-sm text-charcoal/70 sm:text-base">
          Filter by silhouette, fabric, and rent-ready availability. Every style is curated for premium ceremonial wear.
        </p>
      </section>

      <section className="glass-card grid gap-3 rounded-2xl p-4 sm:grid-cols-3 sm:items-end">
        <label className="space-y-1 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-charcoal/60">Silhouette</span>
          <select
            value={silhouette}
            onChange={(event) => setSilhouette(event.target.value as (typeof silhouetteOptions)[number])}
            className="w-full rounded-xl border border-champagne/55 bg-white px-3 py-2"
          >
            {silhouetteOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-charcoal/60">Fabric</span>
          <select
            value={fabric}
            onChange={(event) => setFabric(event.target.value as (typeof fabricOptions)[number])}
            className="w-full rounded-xl border border-champagne/55 bg-white px-3 py-2"
          >
            {fabricOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="inline-flex items-center gap-2 rounded-xl border border-champagne/55 bg-white px-3 py-2 text-sm">
          <input type="checkbox" checked={rentOnly} onChange={(event) => setRentOnly(event.target.checked)} />
          Available for Rent
        </label>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bridalProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
