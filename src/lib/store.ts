"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ShopCategoryId } from "@/content/site";

type CartLine = { id: string; qty: number };
export type Toast = { id: number; text: string; count: number; at: number };
let toastSeq = 0;

type State = {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  shopCategory: ShopCategoryId | null;
  contactPrefill: string;
  toasts: Toast[];
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  openCategory: (c: ShopCategoryId | null) => void;
  prefillContact: (text: string) => void;
  notify: (text: string) => void;
  dismiss: (id: number) => void;
};

const safeStorage = createJSONStorage(() => {
  try {
    const k = "__z_probe";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (n: string) => mem.get(n) ?? null,
      setItem: (n: string, v: string) => void mem.set(n, v),
      removeItem: (n: string) => void mem.delete(n),
    };
  }
});

export const useStore = create<State>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      cartOpen: false,
      searchOpen: false,
      shopCategory: null,
      contactPrefill: "",
      toasts: [],
      add: (id) =>
        set((s) => {
          const hit = s.cart.find((l) => l.id === id);
          return {
            cart: hit ? s.cart.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...s.cart, { id, qty: 1 }],
          };
        }),
      setQty: (id, qty) =>
        set((s) => ({ cart: qty <= 0 ? s.cart.filter((l) => l.id !== id) : s.cart.map((l) => (l.id === id ? { ...l, qty } : l)) })),
      remove: (id) => set((s) => ({ cart: s.cart.filter((l) => l.id !== id) })),
      clear: () => set({ cart: [] }),
      toggleWish: (id) =>
        set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] })),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      openCategory: (shopCategory) => set({ shopCategory }),
      prefillContact: (contactPrefill) => set({ contactPrefill }),
      notify: (text) =>
        set((s) => {
          const last = s.toasts.at(-1);
          // Same message again within a moment → bump a counter instead of stacking duplicates.
          if (last && last.text === text && Date.now() - last.at < 4000) {
            return { toasts: [...s.toasts.slice(0, -1), { ...last, count: last.count + 1, at: Date.now() }] };
          }
          const next = { id: ++toastSeq, text, count: 1, at: Date.now() };
          return { toasts: [...s.toasts, next].slice(-3) };
        }),
      dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "zaghalil-store",
      storage: safeStorage,
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist }),
    }
  )
);
