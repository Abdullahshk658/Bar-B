import Image from "next/image";

import { Reveal } from "@/components/Reveal";
import { products } from "@/lib/data";
import { toCurrency } from "@/lib/rental";

export default function CosmeticsPage() {
  const cosmetics = products.filter((product) => product.category === "Cosmetic");

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">Cosmetics Shop</p>
        <h1 className="font-serif text-4xl sm:text-5xl">Imported Beauty Essentials</h1>
        <p className="max-w-2xl text-sm text-charcoal/70 sm:text-base">
          Clean formulations sourced from premium global partners with verified authenticity.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cosmetics.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.05}>
            <article className="glass-card overflow-hidden rounded-2xl shadow-luxe">
              <div className="relative h-56">
                <Image src={item.heroImage} alt={item.name} fill className="object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-charcoal px-3 py-1 text-xs text-ivory">Imported</span>
              </div>
              <div className="space-y-3 p-4">
                <h2 className="font-serif text-2xl">{item.name}</h2>
                <p className="text-sm text-charcoal/70">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-champagne/40 px-3 py-1 text-sm">{toCurrency(item.price_sale ?? 0)}</span>
                  <span
                    title="Every imported product includes serial verification and supplier chain validation."
                    className="cursor-help text-xs uppercase tracking-[0.14em] text-charcoal/70"
                  >
                    Authenticity Guaranteed
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
