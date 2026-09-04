import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { CoverHero } from "@/components/cover";
import { Wordmark } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { CategoryNav, DesktopSidebar } from "@/components/sidebar";
import { BRAND, DISCLAIMER } from "@/lib/brand";
import { cartCount, useCart } from "@/lib/cart";
import { usePoints } from "@/lib/points";
import { useService } from "@/lib/service";
import { useShip } from "@/lib/shipping";
import { cn } from "@/lib/utils";

function isHomeCover(pathname: string, search: unknown) {
  if (pathname !== "/") return false;
  if (!search) return true;
  if (typeof search === "string") {
    return !/(?:^|[?&])(cat|q|group)=/.test(search);
  }
  if (typeof search === "object") {
    const s = search as Record<string, unknown>;
    return !s.cat && !s.q && !s.group;
  }
  return true;
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search });
  const showCover = isHomeCover(pathname, search);
  const showRail = pathname === "/" || pathname.startsWith("/item") || pathname === "/about" || pathname === "/ship";
  const hydrateCart = useCart((s) => s.hydrate);
  const hydratePts = usePoints((s) => s.hydrate);
  const hydrateShip = useShip((s) => s.hydrate);
  const hydrateService = useService((s) => s.hydrate);
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const pts = usePoints((s) => s.balance);

  useEffect(() => {
    hydrateCart();
    hydratePts();
    hydrateShip();
    hydrateService();
  }, [hydrateCart, hydratePts, hydrateShip, hydrateService]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-sm">
        <div className="bg-accent px-4 py-2.5 text-center text-xs font-medium uppercase tracking-[0.16em] text-accent-fg">
          Military, police & first responders — 15% off everything · {BRAND.origin}
        </div>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <button type="button" className="grid size-11 place-items-center rounded-md md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <Link to="/" search={{}} className="shrink-0"><Wordmark /></Link>
          <SearchBar className="mx-4 hidden min-w-0 flex-1 md:block" />
          <nav className="ml-4 hidden items-center gap-6 lg:flex">
            <Link to="/" search={{}} className={cn("text-sm font-semibold uppercase tracking-[0.18em]", pathname === "/" ? "text-accent" : "text-fg hover:text-accent")}>Catalog</Link>
            <Link to="/ship" className={cn("text-sm font-semibold uppercase tracking-[0.18em]", pathname === "/ship" ? "text-accent" : "text-fg hover:text-accent")}>Ship</Link>
            <Link to="/about" className={cn("text-sm font-semibold uppercase tracking-[0.18em]", pathname === "/about" ? "text-accent" : "text-fg hover:text-accent")}>About</Link>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Link to="/cart" className="hidden h-11 items-center px-3 text-xs uppercase tracking-[0.16em] text-muted hover:text-fg sm:flex" aria-label="Bridge points">{pts.toLocaleString()} pts</Link>
            <Link to="/cart" className="relative grid size-11 place-items-center rounded-md text-fg transition-colors hover:bg-elevated" aria-label="Bag">
              <ShoppingBag className="size-4" />
              {count > 0 ? <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-sm bg-accent px-1 text-xs leading-4 text-accent-fg">{count}</span> : null}
            </Link>
          </div>
        </div>
        {open ? (
          <div className="max-h-[80dvh] overflow-y-auto border-t border-line bg-surface px-4 py-4 md:hidden">
            <nav className="mb-6 flex flex-col">
              <Link to="/" search={{}} className="flex h-11 items-center text-sm uppercase tracking-[0.14em] text-fg">Catalog</Link>
              <Link to="/ship" className="flex h-11 items-center text-sm uppercase tracking-[0.14em] text-fg">Ship</Link>
              <Link to="/about" className="flex h-11 items-center text-sm uppercase tracking-[0.14em] text-fg">About</Link>
            </nav>
            <CategoryNav onNavigate={() => setOpen(false)} />
          </div>
        ) : null}
        <div className="border-t border-line px-4 py-2 md:hidden"><SearchBar /></div>
      </header>
      <div className="border-b border-line bg-surface">
        <p className="mx-auto max-w-7xl px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-sniper">Private surplus · no firearms · 5% under street · free ground $150+ · free overnight $1,500+ · 1,000 pts / $100 · 100 pts = $3</p>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4">
        {showRail ? <DesktopSidebar /> : null}
        <div className="min-w-0 flex-1">{showCover ? <CoverHero /> : null}{children}</div>
      </div>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-3">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{BRAND.tagline}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-accent">{BRAND.origin}</p>
          </div>
          <div className="text-sm">
            <p className="font-display text-xl text-fg">Depot desk</p>
            <p className="mt-2 text-muted">{BRAND.street}<br />{BRAND.city}, {BRAND.state} {BRAND.zip}<br />{BRAND.phone} · {BRAND.hours}</p>
          </div>
          <div className="text-sm">
            <p className="font-display text-xl text-fg">Issue rules</p>
            <p className="mt-2 text-muted">We sell the kit around the gun. Not the gun. Cans are on the rack — Form 4 later. Private surplus desk, not a U.S. Government website.</p>
            <p className="mt-4 text-xs leading-relaxed text-subtle">{DISCLAIMER}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
