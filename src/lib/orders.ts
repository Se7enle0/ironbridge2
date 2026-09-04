import type { ShipMethod } from "@/lib/shipping";

const KEY = "ironbridge-orders-v1";

export type PayMethod = "paypal" | "debit" | "credit" | "points";

export const PAY_LABEL: Record<PayMethod, string> = {
  paypal: "PayPal",
  debit: "Debit card",
  credit: "Credit card",
  points: "Bridge points",
};

export type Order = {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  total: number;
  pointsEarned?: number;
  pointsRedeemed?: number;
  payMethod?: PayMethod;
  payLast4?: string;
  shipping?: number;
  shipMethod?: ShipMethod;
  zip?: string;
  service?: boolean;
  lines: { title: string; qty: number; price: number }[];
};

function read(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  const next = [order, ...read()];
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function getOrder(id: string) {
  return read().find((o) => o.id === id);
}
