import { dashboardPurchases, dashboardRentals, products } from "@/lib/data";
import { AdminProductUploadForm } from "@/components/AdminProductUploadForm";
import { toCurrency } from "@/lib/rental";

const getName = (productId: string) => products.find((product) => product.id === productId)?.name ?? productId;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">User Dashboard</p>
        <h1 className="font-serif text-4xl sm:text-5xl">Orders & Rental Timeline</h1>
        <p className="text-sm text-charcoal/70 sm:text-base">
          Track upcoming returns, completed rentals, and your premium beauty purchases.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Rental Return Dates</h2>
          <ul className="mt-4 space-y-3">
            {dashboardRentals.map((rental) => (
              <li key={rental.id} className="rounded-xl bg-white p-3 text-sm">
                <p className="font-medium">{getName(rental.product_id)}</p>
                <p className="text-charcoal/70">
                  {rental.start_date} to {rental.end_date}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-charcoal/60">Status: {rental.status}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Past Purchases</h2>
          <ul className="mt-4 space-y-3">
            {dashboardPurchases.map((purchase) => (
              <li key={purchase.id} className="rounded-xl bg-white p-3 text-sm">
                <p className="font-medium">{purchase.productName}</p>
                <p className="text-charcoal/70">Order {purchase.id}</p>
                <p className="text-charcoal/70">{purchase.purchasedAt}</p>
                <p className="mt-1 inline-block rounded-full bg-champagne/45 px-2 py-1 text-xs">
                  {toCurrency(purchase.total)}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <AdminProductUploadForm />
      </section>
    </div>
  );
}
