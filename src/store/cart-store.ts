import { create } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  image?: string;
  color: string;
  size: string;
  pvId: number;
};

type CartStore = {
  items: CartItem[];
  updateFromDb: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  updateFromDb: (items) => {
    set({ items });
  },

  addToCart: (item) => {
    const existing = get().items.find((i) => i.pvId === item.pvId);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.pvId === item.pvId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, item] });
    }
  },

  removeFromCart: (pvId) => {
    set({ items: get().items.filter((i) => i.pvId !== pvId) });
  },

  updateQuantity: (pvId, quantity) => {
    set({
      items: get().items.map((i) => (i.pvId === pvId ? { ...i, quantity } : i)),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  totalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));
