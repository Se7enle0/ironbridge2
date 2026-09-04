import { CATEGORIES, NAV_GROUPS, PRODUCTS, categoryLabel, money, type Product } from "./catalog";
export type SearchHit =
  | { kind: "dept"; id: string; label: string; hint: string }
  | { kind: "aisle"; id: string; label: string; hint: string }
  | { kind: "maker"; id: string; label: string; hint: string }
  | { kind: "item"; id: string; label: string; hint: string; photo: string; price: number };
function score(hay: string, q: string) {
  const h = hay.toLowerCase();
  if (h === q) return 0; if (h.startsWith(q)) return 1;
  const idx = h.indexOf(q); if (idx >= 0) return 2 + idx / 100; return 99;
}
export function predict(raw: string, limit = 8): SearchHit[] {
  const q = raw.trim().toLowerCase(); if (q.length < 1) return [];
  const depts: SearchHit[] = NAV_GROUPS.filter((g) => g.group.toLowerCase().includes(q) || g.slug.includes(q.replace(/\s+/g, "-"))).map((g) => ({ kind: "dept", id: g.slug, label: g.group, hint: "Department" }));
  const aisles: SearchHit[] = CATEGORIES.filter((c) => c.label.toLowerCase().includes(q) || c.id.includes(q.replace(/\s+/g, "-"))).map((c) => ({ kind: "aisle", id: c.id, label: c.label, hint: c.group }));
  const makers = new Map<string, number>();
  for (const p of PRODUCTS) { if (!p.maker.toLowerCase().includes(q)) continue; makers.set(p.maker, (makers.get(p.maker) ?? 0) + 1); }
  const makerHits: SearchHit[] = [...makers.entries()].sort((a, b) => score(a[0], q) - score(b[0], q) || b[1] - a[1]).slice(0, 4).map(([maker, n]) => ({ kind: "maker", id: maker, label: maker, hint: `${n} tickets` }));
  const items: Product[] = [];
  for (const p of PRODUCTS) { const hay = `${p.title} ${p.maker} ${p.category}`; if (!hay.toLowerCase().includes(q)) continue; items.push(p); if (items.length > 40) break; }
  items.sort((a, b) => score(a.title, q) - score(b.title, q) || a.title.localeCompare(b.title));
  const itemHits: SearchHit[] = items.slice(0, limit).map((p) => ({ kind: "item", id: p.id, label: p.title, hint: `${p.maker} · ${categoryLabel(p.category)} · ${money(p.price)}`, photo: p.photo, price: p.price }));
  return [...depts.slice(0, 3), ...aisles.slice(0, 4), ...makerHits.slice(0, 3), ...itemHits].slice(0, 12);
}
