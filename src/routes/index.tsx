import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Page, Eyebrow } from "@/components/page";
import { ListingCard, ListingGrid } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { NAV_GROUPS, PRODUCTS, categoryIdsForGroup, categoryLabel, featuredProducts, groupLabel } from "@/lib/catalog";

export type HomeSearch = { q?: string; cat?: string; group?: string; page?: number };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): HomeSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
    group: typeof s.group === "string" ? s.group : undefined,
    page: typeof s.page === "number" && s.page > 0 ? Math.floor(s.page) : undefined,
  }),
  component: Home,
});

const PAGE = 24;

function Home() {
  const { q = "", cat, group, page = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const featured = featuredProducts();
  const catLabel = cat ? categoryLabel(cat) : null;
  const deptLabel = !cat && group ? groupLabel(group) : null;
  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    const aisleIds = group ? categoryIdsForGroup(group) : [];
    return PRODUCTS.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (!cat && group && !aisleIds.includes(p.category)) return false;
      if (query) {
        const hay = `${p.title} ${p.maker} ${p.description}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [q, cat, group]);
  const pages = Math.max(1, Math.ceil(items.length / PAGE));
  const safePage = Math.min(Math.max(1, page), pages);
  const slice = items.slice((safePage - 1) * PAGE, (safePage - 1) * PAGE + PAGE);
  const setSearch = (next: HomeSearch) => {
    void navigate({
      search: { q: next.q || undefined, cat: next.cat || undefined, group: next.group || undefined, page: next.page && next.page > 1 ? next.page : undefined },
    });
  };
  return (
    <div>
      <Page className="px-0">
        {!cat && !q && !group && featured.length > 0 ? (
          <div className="mb-14">
            <Eyebrow>Depot issue</Eyebrow>
            <h2 className="mt-2 font-display text-3xl text-fg">Priority rack</h2>
            <div className="mt-6"><ListingGrid>{featured.map((p) => <ListingCard key={p.id} product={p} />)}</ListingGrid></div>
          </div>
        ) : null}
        <Eyebrow>Inventory</Eyebrow>
        <h2 id="floor" className="mt-2 scroll-mt-32 font-display text-3xl text-fg">{catLabel ?? deptLabel ?? (q ? `Search “${q}”` : "The rack")} · {items.length.toLocaleString()} SKUs</h2>
        {cat || group || q ? (
          <p className="mt-4 text-sm text-muted">{cat || group ? `Aisle: ${catLabel ?? deptLabel}` : `Matches for “${q}”`} <Link to="/" search={{}} className="text-accent hover:underline">clear</Link></p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {NAV_GROUPS.map((g) => (
              <Link key={g.slug} to="/" search={{ group: g.slug }} className="rounded-sm border border-line bg-surface px-3 py-2 text-xs uppercase tracking-[0.14em] text-sniper hover:border-accent hover:text-accent">{g.group}</Link>
            ))}
          </div>
        )}
        <p className="mt-6 text-xs uppercase tracking-[0.16em] text-subtle">{items.length.toLocaleString()} items · page {safePage} of {pages}</p>
        <div className="mt-4">{items.length === 0 ? <p className="text-sm text-muted">Nothing in that aisle.</p> : <ListingGrid>{slice.map((p) => <ListingCard key={p.id} product={p} />)}</ListingGrid>}</div>
        {pages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button variant="secondary" disabled={safePage <= 1} onClick={() => setSearch({ q, cat, group, page: safePage - 1 })}>Previous</Button>
            <Button variant="secondary" disabled={safePage >= pages} onClick={() => setSearch({ q, cat, group, page: safePage + 1 })}>Next</Button>
          </div>
        ) : null}
      </Page>
    </div>
  );
}
