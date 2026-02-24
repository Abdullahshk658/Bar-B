"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxHero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 460], [0, 90]);

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-luxe">
      <motion.video
        style={{ y }}
        autoPlay
        muted
        loop
        playsInline
        className="h-[64vh] min-h-[470px] w-full object-cover"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-bride-fixes-her-veil-9476/1080p.mp4"
          type="video/mp4"
        />
      </motion.video>
      <div className="hero-overlay absolute inset-0" />

      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <div className="max-w-xl text-white">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-3 text-xs uppercase tracking-[0.2em] text-champagne"
          >
            Couture Bridal Atelier
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08 }}
            className="font-serif text-4xl leading-tight sm:text-5xl"
          >
            Luxury Bridal Dresses in 3D. Buy or Rent with Confidence.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.16 }}
            className="mt-4 max-w-lg text-sm text-white/90 sm:text-base"
          >
            Explore high-fashion silhouettes, lock your event dates, and pair the look with imported beauty essentials.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24 }}
            className="mt-6 flex gap-3"
          >
            <Link href="/bridal" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-charcoal">
              Shop Bridal
            </Link>
            <Link href="/cosmetics" className="rounded-full border border-white/80 px-6 py-3 text-sm font-semibold">
              Discover Cosmetics
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
