import { notFound } from "next/navigation";

import { BridalDetailClient } from "@/components/BridalDetailClient";
import { products, rentals } from "@/lib/data";

export function generateStaticParams() {
  return products
    .filter((product) => product.category === "Bridal")
    .map((product) => ({
      id: product.id
    }));
}

export default async function BridalDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product || product.category !== "Bridal") {
    notFound();
  }

  const existingRentals = rentals.filter((rental) => rental.product_id === product.id);

  return <BridalDetailClient product={product} existingRentals={existingRentals} />;
}
