import { create } from "zustand";

const KEY = "ironbridge-service-v1";

type ServiceState = {
  claimed: boolean;
  hydrated: boolean;
  hydrate: () => void;
  setClaimed: (claimed: boolean) => void;
};

function read(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function write(claimed: boolean) {
  localStorage.setItem(KEY, claimed ? "1" : "0");
}

export const useService = create<ServiceState>((set, get) => ({
  claimed: false,
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ claimed: read(), hydrated: true });
  },
  setClaimed: (claimed) => {
    write(claimed);
    set({ claimed });
  },
}));
