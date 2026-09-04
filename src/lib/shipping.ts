import { create } from "zustand";

export type ShipMethod = "ground" | "2day" | "overnight";
export const FREE_GROUND = 15000;
export const FREE_OVERNIGHT = 150000;
export const NFA_BOX = 1500;

export const SHIP_METHODS: { id: ShipMethod; label: string; hint: string }[] = [
  { id: "ground", label: "Ground", hint: "Free on tickets of $150+" },
  { id: "2day", label: "2-day", hint: "Two business days · free $150+" },
  { id: "overnight", label: "Overnight", hint: "Next business day · free $1,500+" },
];

type Zone = { id: string; label: string; ground: number; eta: string; remote?: boolean };
export type ShipQuote = {
  ready: boolean; zip: string; method: ShipMethod; zone: string; eta: string;
  ground: number; cents: number; free: boolean; nfaFee: number; remote: boolean;
};
const KEY = "ironbridge-ship-v1";
type Pref = { zip: string; method: ShipMethod };
type ShipState = Pref & { hydrated: boolean; hydrate: () => void; setZip: (zip: string) => void; setMethod: (method: ShipMethod) => void; };
function cleanZip(raw: string) { return raw.replace(/\D/g, "").slice(0, 5); }
function read(): Pref {
  if (typeof window === "undefined") return { zip: "", method: "ground" };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { zip: "", method: "ground" };
    const p = JSON.parse(raw) as Partial<Pref>;
    const method = p.method === "2day" || p.method === "overnight" ? p.method : "ground";
    return { zip: cleanZip(p.zip ?? ""), method };
  } catch { return { zip: "", method: "ground" }; }
}
function write(p: Pref) { localStorage.setItem(KEY, JSON.stringify(p)); }
export const useShip = create<ShipState>((set, get) => ({
  zip: "", method: "ground", hydrated: false,
  hydrate: () => { if (get().hydrated) return; set({ ...read(), hydrated: true }); },
  setZip: (zip) => { const next = { zip: cleanZip(zip), method: get().method }; write(next); set(next); },
  setMethod: (method) => { const next = { zip: get().zip, method }; write(next); set(next); },
}));
export function zoneForZip(zip: string): Zone | null {
  const z = cleanZip(zip); if (z.length < 5) return null;
  const n3 = Number(z.slice(0, 3));
  if (n3 >= 995 && n3 <= 999) return { id: "ak", label: "Alaska", ground: 2895, eta: "6–10 days", remote: true };
  if (n3 >= 967 && n3 <= 968) return { id: "hi", label: "Hawaii", ground: 2695, eta: "6–10 days", remote: true };
  if (n3 === 969) return { id: "pi", label: "Pacific islands", ground: 3295, eta: "8–12 days", remote: true };
  if (n3 >= 6 && n3 <= 9) return { id: "pr", label: "Puerto Rico", ground: 1895, eta: "5–8 days", remote: true };
  switch (z[0]) {
    case "3": return { id: "se", label: "Southeast · from Orlando", ground: 695, eta: "2–4 days" };
    case "2": return { id: "atl", label: "Carolinas & Mid-Atlantic", ground: 895, eta: "3–5 days" };
    case "4": return { id: "mw", label: "Ohio Valley & Great Lakes", ground: 995, eta: "3–5 days" };
    case "7": return { id: "sc", label: "South Central", ground: 995, eta: "3–5 days" };
    case "0": case "1": return { id: "ne", label: "Northeast", ground: 1295, eta: "4–6 days" };
    case "5": return { id: "up", label: "Upper Midwest", ground: 1395, eta: "4–6 days" };
    case "6": return { id: "pl", label: "Plains", ground: 1295, eta: "4–6 days" };
    case "8": return { id: "mt", label: "Mountain West", ground: 1595, eta: "5–7 days" };
    case "9": return { id: "wc", label: "West Coast", ground: 1895, eta: "5–7 days" };
    default: return { id: "us", label: "United States", ground: 1295, eta: "4–7 days" };
  }
}
function methodAdd(method: ShipMethod, remote: boolean) {
  if (method === "2day") return remote ? 2495 : 1495;
  if (method === "overnight") return remote ? 4995 : 3495;
  return 0;
}
function etaFor(method: ShipMethod, zone: Zone) {
  if (method === "2day") return zone.remote ? "2 business days · remote lane" : "2 business days";
  if (method === "overnight") return zone.remote ? "Next business day · remote lane" : "Next business day";
  return zone.eta;
}
export function quoteShipping(args: { subtotal: number; zip: string; method: ShipMethod; nfa?: boolean; }): ShipQuote {
  const zip = cleanZip(args.zip);
  const zone = zoneForZip(zip);
  const nfaFee = args.nfa ? NFA_BOX : 0;
  if (!zone) return { ready: false, zip, method: args.method, zone: "", eta: "", ground: 0, cents: 0, free: false, nfaFee, remote: false };
  const remote = Boolean(zone.remote);
  const groundFree = args.subtotal >= FREE_GROUND && args.subtotal > 0;
  const free = args.subtotal > 0 && (args.method === "overnight" ? args.subtotal >= FREE_OVERNIGHT : groundFree);
  const nfaOn = groundFree ? 0 : nfaFee;
  const ground = groundFree ? 0 : zone.ground;
  const cents = args.subtotal <= 0 ? 0 : free ? 0 : ground + methodAdd(args.method, remote) + nfaOn;
  return { ready: true, zip, method: args.method, zone: zone.label, eta: etaFor(args.method, zone), ground: zone.ground, cents, free, nfaFee: nfaOn, remote };
}
export function methodLabel(method: ShipMethod) { return SHIP_METHODS.find((m) => m.id === method)?.label ?? method; }
export { cleanZip };
