import type { Product, Rental } from "@/lib/types";

export const products: Product[] = [
  {
    id: "bridal-01",
    name: "Celeste Pearl Gown",
    category: "Bridal",
    price_sale: 3200,
    price_rent: 820,
    stock: 3,
    is_3d_enabled: true,
    model_url: "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat",
    silhouette: "A-Line",
    fabric: "Lace",
    heroImage:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80",
    description: "A couture lace silhouette with hand-sewn beadwork and cathedral-length train."
  },
  {
    id: "bridal-02",
    name: "Ivory Solstice",
    category: "Bridal",
    price_sale: 4100,
    price_rent: 980,
    stock: 2,
    is_3d_enabled: true,
    model_url: "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/garden/garden-7k.splat",
    silhouette: "Mermaid",
    fabric: "Satin",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    description: "Sculpted satin with shimmering contours built for evening ceremonies."
  },
  {
    id: "bridal-03",
    name: "Duchess Bloom",
    category: "Bridal",
    price_sale: 3650,
    price_rent: 900,
    stock: 4,
    is_3d_enabled: true,
    model_url: "https://sketchfab.com/models/a548e866e826434ea95bb4b5dcc24c54/embed",
    silhouette: "Ball Gown",
    fabric: "Organza",
    heroImage:
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=1200&q=80",
    description: "Layered organza volume and regal corsetry for grand entrances."
  },
  {
    id: "cos-01",
    name: "Lumiere Silk Foundation",
    category: "Cosmetic",
    price_sale: 68,
    price_rent: null,
    stock: 24,
    is_3d_enabled: false,
    model_url: null,
    imported: true,
    heroImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    description: "Imported long-wear liquid foundation with radiant satin finish."
  },
  {
    id: "cos-02",
    name: "Velvet Rose Lip Set",
    category: "Cosmetic",
    price_sale: 52,
    price_rent: null,
    stock: 30,
    is_3d_enabled: false,
    model_url: null,
    imported: true,
    heroImage:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    description: "Luxury matte shades curated for bridal day-to-night transitions."
  }
];

export const rentals: Rental[] = [
  {
    id: "rent-01",
    product_id: "bridal-01",
    start_date: "2026-03-10",
    end_date: "2026-03-14",
    user_id: "user-44",
    status: "booked"
  },
  {
    id: "rent-02",
    product_id: "bridal-01",
    start_date: "2026-04-02",
    end_date: "2026-04-04",
    user_id: "user-19",
    status: "booked"
  },
  {
    id: "rent-03",
    product_id: "bridal-02",
    start_date: "2026-03-18",
    end_date: "2026-03-21",
    user_id: "user-11",
    status: "active"
  }
];

export const dashboardRentals: Rental[] = [
  {
    id: "rent-me-01",
    product_id: "bridal-01",
    start_date: "2026-03-25",
    end_date: "2026-03-28",
    user_id: "me",
    status: "booked"
  },
  {
    id: "rent-me-02",
    product_id: "bridal-02",
    start_date: "2026-01-14",
    end_date: "2026-01-16",
    user_id: "me",
    status: "returned"
  }
];

export const dashboardPurchases = [
  {
    id: "po-0933",
    productName: "Lumiere Silk Foundation",
    total: 68,
    purchasedAt: "2026-02-11"
  },
  {
    id: "po-0812",
    productName: "Velvet Rose Lip Set",
    total: 52,
    purchasedAt: "2026-01-27"
  }
];
