export type ProductCategory = "Bridal" | "Cosmetic";
export type ProductMode = "sale" | "rental";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price_sale: number | null;
  price_rent: number | null;
  stock: number;
  is_3d_enabled: boolean;
  model_url: string | null;
  silhouette?: "A-Line" | "Mermaid" | "Ball Gown" | "Sheath";
  fabric?: "Lace" | "Satin" | "Tulle" | "Organza";
  imported?: boolean;
  heroImage: string;
  description: string;
};

export type Rental = {
  id: string;
  product_id: string;
  start_date: string;
  end_date: string;
  user_id: string;
  status: "pending" | "booked" | "active" | "returned" | "cancelled";
};

export type CartItem = {
  id: string;
  productId: string;
  mode: ProductMode;
  quantity: number;
  startDate?: string;
  endDate?: string;
  deposit?: number;
};
