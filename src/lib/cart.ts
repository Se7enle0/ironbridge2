import { create } from "zustand";
import { getProduct, type Product } from "@/lib/catalog";
import { ticketPrice } from "@/lib/pricing";

const KEY = "ironbridge-cart-v1";
export type CartLine = { listingId: string; qty: number };
type CartState = {
  items: CartLine[]; hydrated: boolean; hydrate: () => void;
  add: (listingId: string, qty?: number) => { ok: boolean; message: string };
  setQty: (listingId: string, qty: number) => void; remove: (listingId: string) => void; clear: () => void;
};
function read(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed.filter((l) => l.listingId && l.qty > 0) : [];
  } catch { return []; }
}
function write(items: CartLine[]) { localStorage.setItem(KEY, JSON.stringify(items)); }
export const useCart = create<CartState>((set, get) => ({
  items: [], hydrated: false,
  hydrate: () => { if (get().hydrated) return; set({ items: read(), hydrated: true }); },
  add: (listingId, qty = 1) => {
    const listing = getProduct(listingId);
    if (!listing) return { ok: false, message: "Item not found." };
    const current = get().items.find((i) => i.listingId === listingId)?.qty ?? 0;
    const next = Math.min(listing.qty, current + qty);
    if (next <= current) return { ok: false, message: "That's all we have of this one." };
    const items = get().items.some((i) => i.listingId === listingId)
      ? get().items.map((i) => (i.listingId === listingId ? { ...i, qty: next } : i))
      : [...get().items, { listingId, qty: next }];
    write(items); set({ items }); return { ok: true, message: "Added to bag." };
  },
  setQty: (listingId, qty) => {
    const listing = getProduct(listingId);
    const capped = Math.max(0, Math.min(qty, listing?.qty ?? 0));
    const items = capped === 0 ? get().items.filter((i) => i.listingId !== listingId) : get().items.map((i) => (i.listingId === listingId ? { ...i, qty: capped } : i));
    write(items); set({ items });
  },
  remove: (listingId) => { const items = get().items.filter((i) => i.listingId !== listingId); write(items); set({ items }); },
  clear: () => { write([]); set({ items: [] }); },
}));
export type ResolvedLine = CartLine & { listing: Product };
export function resolveCart(items: CartLine[]): ResolvedLine[] {
  return items.map((l) => { const listing = getProduct(l.listingId); return listing ? { ...l, listing } : null; }).filter((x): x is ResolvedLine => Boolean(x));
}
export function cartCount(items: CartLine[]) { return items.reduce((n, l) => n + l.qty, 0); }
export function cartStreet(items: CartLine[]) { return resolveCart(items).reduce((n, l) => n + l.listing.price * l.qty, 0); }
export function cartSubtotal(items: CartLine[], service = false) { return resolveCart(items).reduce((n, l) => n + ticketPrice(l.listing.price, service) * l.qty, 0); }
