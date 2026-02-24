"use client";

import { type FormEvent, useState } from "react";

const GSPLAT_URL_PATTERN = /\.(splat|ply)(\?.*)?$/i;

export const AdminProductUploadForm = () => {
  const [productName, setProductName] = useState("");
  const [splatUrl, setSplatUrl] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: ""
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = productName.trim();
    const trimmedUrl = splatUrl.trim();

    if (!trimmedName) {
      setStatus({ type: "error", message: "Product name is required." });
      return;
    }

    if (!GSPLAT_URL_PATTERN.test(trimmedUrl)) {
      setStatus({ type: "error", message: "Model URL must end with .splat or .ply." });
      return;
    }

    setStatus({
      type: "success",
      message: `Saved ${trimmedName} with 3DGS URL ${trimmedUrl}`
    });
  };

  return (
    <article className="glass-card rounded-2xl p-5">
      <h2 className="font-serif text-2xl">Product Upload</h2>
      <p className="mt-2 text-sm text-charcoal/75">
        Register bridal models using a direct Gaussian Splat URL.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <label className="block space-y-1 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-charcoal/60">Product Name</span>
          <input
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            className="w-full rounded-xl border border-champagne/55 bg-white px-3 py-2"
            placeholder="e.g. Celeste Pearl Gown"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-xs uppercase tracking-[0.14em] text-charcoal/60">3D Model URL</span>
          <input
            type="url"
            value={splatUrl}
            onChange={(event) => setSplatUrl(event.target.value)}
            className="w-full rounded-xl border border-champagne/55 bg-white px-3 py-2"
            placeholder="https://.../dress.splat"
          />
          <span className="text-xs text-charcoal/60">Accepted formats: `.splat` and `.ply`</span>
        </label>

        <button type="submit" className="rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-ivory">
          Save Product
        </button>
      </form>

      <p className="mt-4 rounded-xl border border-champagne/50 bg-white/75 p-3 text-sm text-charcoal/75">
        For best quality, upload models generated from 50+ high-res photos rather than video.
      </p>

      {status.type !== "idle" ? (
        <p className={`mt-3 text-sm ${status.type === "success" ? "text-emerald-700" : "text-red-700"}`}>{status.message}</p>
      ) : null}
    </article>
  );
};
