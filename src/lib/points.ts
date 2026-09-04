import { create } from "zustand";

const KEY = "ironbridge-points-v1";

type PointsState = {
  balance: number;
  hydrated: boolean;
  hydrate: () => void;
  credit: (pts: number) => void;
  debit: (pts: number) => boolean;
};

function read(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

function write(n: number) {
  localStorage.setItem(KEY, String(Math.max(0, Math.floor(n))));
}

export const usePoints = create<PointsState>((set, get) => ({
  balance: 0,
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ balance: read(), hydrated: true });
  },
  credit: (pts) => {
    const next = get().balance + Math.max(0, Math.floor(pts));
    write(next);
    set({ balance: next });
  },
  debit: (pts) => {
    const take = Math.max(0, Math.floor(pts));
    const cur = get().balance;
    if (take > cur) return false;
    const next = cur - take;
    write(next);
    set({ balance: next });
    return true;
  },
}));
