import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";

import "@/app/globals.css";
import { Header } from "@/components/Header";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"]
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Bridal3D & Glow",
  description: "Premium bridal and imported cosmetics with immersive 3D previews."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable} bg-cream bg-luxe-gradient font-sans text-charcoal`}>
        <Header />
        <main className="mx-auto w-full max-w-[1300px] px-4 pb-20 pt-6 sm:px-6 lg:px-10">{children}</main>
      </body>
    </html>
  );
}
