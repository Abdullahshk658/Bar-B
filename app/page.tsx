import Link from "next/link";

import { ParallaxHero } from "@/components/ParallaxHero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/lib/data";

const featured3D = products.filter((product) => product.category === "Bridal" && product.is_3d_enabled).slice(0, 2);
const cosmeticArrivals = products.filter((product) => product.category === "Cosmetic");

export default function HomePage() {
  return (
    <div className="space-y-14 pb-6 sm:space-y-16">
      <ParallaxHero />

      <Reveal>
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">Featured 3D Collections</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">The Virtual Atelier</h2>
            </div>
            <Link href="/bridal" className="text-sm uppercase tracking-[0.14em] text-charcoal/70 underline-offset-4 hover:underline">
              View all gowns
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {featured3D.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.12}>
        <section className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">New Arrivals</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Imported Cosmetics</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {cosmeticArrivals.map((product) => (
              <ProductCard key={product.id} product={product} href="/cosmetics" />
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
