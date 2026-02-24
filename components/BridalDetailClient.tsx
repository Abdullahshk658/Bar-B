"use client";

import { differenceInCalendarDays, format } from "date-fns";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Bridal3DViewer } from "@/components/Bridal3DViewer";
import { RentalCalendar, type RentalDateRange } from "@/components/RentalCalendar";
import {
  calculateSecurityDeposit,
  getBookedDates,
  getMinimumRentalStartDate,
  isRangeOverlapping,
  toCurrency
} from "@/lib/rental";
import type { Product, Rental } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";

export const BridalDetailClient = ({
  product,
  existingRentals
}: {
  product: Product;
  existingRentals: Rental[];
}) => {
  const [mode, setMode] = useState<"sale" | "rental">("sale");
  const [range, setRange] = useState<RentalDateRange | undefined>();
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState(product.model_url);

  const addItem = useCartStore((state) => state.addItem);
  const deposit = useMemo(() => calculateSecurityDeposit(product.price_rent ?? 0), [product.price_rent]);
  const bookedDates = useMemo(() => getBookedDates(existingRentals), [existingRentals]);
  const minDate = useMemo(() => getMinimumRentalStartDate(), []);

  const rentalDays = useMemo(() => {
    if (!range?.from || !range.to) {
      return 0;
    }
    return differenceInCalendarDays(range.to, range.from) + 1;
  }, [range]);

  const rentalTotal = useMemo(() => {
    if (!product.price_rent || rentalDays < 1) {
      return 0;
    }
    return product.price_rent * rentalDays + deposit;
  }, [deposit, product.price_rent, rentalDays]);

  const handleAdd = () => {
    if (mode === "sale" && product.price_sale) {
      addItem({
        mode,
        productId: product.id,
        quantity: 1
      });
      return;
    }

    if (mode === "rental" && product.price_rent && range?.from && range.to) {
      if (isRangeOverlapping(range.from, range.to, existingRentals)) {
        setProcessingError("Selected dates overlap with an existing booking.");
        return;
      }

      addItem({
        mode,
        productId: product.id,
        quantity: 1,
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: format(range.to, "yyyy-MM-dd"),
        deposit
      });
    }
  };

  const handleVideoConversion = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setProcessing(true);
    setProcessingError(null);

    try {
      const response = await fetch("/api/convert-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoName: file.name })
      });

      if (!response.ok) {
        throw new Error("Could not convert this upload.");
      }

      const payload = (await response.json()) as { modelUrl: string };
      setModelUrl(payload.modelUrl);
    } catch (error) {
      setProcessingError(error instanceof Error ? error.message : "Failed to process upload.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        {modelUrl ? (
          <Bridal3DViewer modelUrl={modelUrl} />
        ) : (
          <div className="flex h-[420px] items-center justify-center rounded-2xl border border-champagne/50 bg-white text-sm text-charcoal/70 sm:h-[560px]">
            No 3D Gaussian Splat model available yet.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/60">Bridal 3D Detail</p>
        <h1 className="font-serif text-4xl leading-tight">{product.name}</h1>
        <p className="text-sm text-charcoal/70">{product.description}</p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode("sale")}
            className={`rounded-full px-4 py-2 text-sm ${mode === "sale" ? "bg-charcoal text-ivory" : "bg-white"}`}
          >
            Buy {product.price_sale ? toCurrency(product.price_sale) : "N/A"}
          </button>
          <button
            onClick={() => setMode("rental")}
            disabled={!product.price_rent}
            className={`rounded-full px-4 py-2 text-sm ${
              mode === "rental" ? "bg-charcoal text-ivory" : "bg-white"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Rent {product.price_rent ? toCurrency(product.price_rent) : "N/A"}
          </button>
        </div>

        {mode === "rental" && product.price_rent ? (
          <RentalCalendar
            bookedDates={bookedDates}
            minDate={minDate}
            selected={range}
            onChange={setRange}
            rentPrice={product.price_rent}
            deposit={deposit}
          />
        ) : null}

        {mode === "rental" && rentalDays > 0 ? (
          <p className="rounded-xl bg-white p-3 text-sm">
            {rentalDays} day rental total: <strong>{toCurrency(rentalTotal)}</strong>
          </p>
        ) : null}

        <button onClick={handleAdd} className="w-full rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory">
          Add to cart
        </button>

        <div className="rounded-2xl border border-dashed border-champagne bg-ivory p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-charcoal/60">Virtual Atelier Upload</p>
          <p className="mt-2 text-sm text-charcoal/75">Upload a gown video and we will convert it to a 3D preview model.</p>
          <input
            type="file"
            accept="video/*"
            onChange={(event) => handleVideoConversion(event.target.files?.[0])}
            className="mt-3 w-full rounded-lg border border-champagne/50 bg-white p-2 text-sm"
          />
          {processing ? (
            <motion.p
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
              className="mt-3 text-sm font-medium text-charcoal"
            >
              Processing upload... generating 3D model.
            </motion.p>
          ) : null}
          {processingError ? <p className="mt-2 text-sm text-red-700">{processingError}</p> : null}
        </div>
      </section>
    </div>
  );
};
