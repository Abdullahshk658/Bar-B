import { create } from "zustand";

import type { CartItem } from "@/lib/types";

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: () => number;
};

const makeId = () => `cart-${Date.now()}-${Math.round(Math.random() * 1000)}`;

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, id: makeId() }]
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    })),
  clearCart: () => set({ items: [] }),
  cartCount: () => get().items.reduce((total, item) => total + item.quantity, 0)
}));
