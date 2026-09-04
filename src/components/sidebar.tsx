import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { NAV_GROUPS, countByCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function CategoryNav({ onNavigate }: { onNavigate?: () => void }) {
  const search = useRouterState({ select: (s) => s.location.search }) as { cat?: string; group?: string };
  const counts = countByCategory();
  const activeCat = typeof search.cat === "string" ? search.cat : undefined;
  const activeGroup = typeof search.group === "string" ? search.group : undefined;
  return (
    <nav aria-label="Aisles">
      <p className="mb-3 font-display text-lg uppercase tracking-[0.18em] text-accent">Aisles</p>
      <Link to="/" search={{}} onClick={onNavigate} className={cn("flex h-11 items-center border-l-2 pl-3 text-sm uppercase tracking-[0.14em]", !activeCat && !activeGroup ? "border-accent text-accent" : "border-transparent text-muted hover:text-fg")}>All items</Link>
      {NAV_GROUPS.map((g) => {
        const total = g.items.reduce((n, c) => n + (counts[c.id] ?? 0), 0);
        const open = activeGroup === g.slug || g.items.some((c) => c.id === activeCat);
        return (
          <div key={g.slug} className="mt-1">
            <Link to="/" search={{ group: g.slug }} onClick={onNavigate} className={cn("flex h-10 items-center justify-between gap-2 border-l-2 pl-3 font-display text-sm uppercase tracking-[0.14em]", activeGroup === g.slug && !activeCat ? "border-accent text-accent" : open ? "border-accent/50 text-fg" : "border-transparent text-fg hover:text-accent")}>
              <span className="min-w-0 truncate">{g.group}</span>
              <span className="flex shrink-0 items-center gap-1">
                <span className="font-mono text-xs font-normal tracking-normal text-sniper">{total}</span>
                <ChevronDown className={cn("size-3.5 text-sniper transition-transform", open && "rotate-180")} />
              </span>
            </Link>
            {open ? (
              <ul>
                {g.items.map((c) => (
                  <li key={c.id}>
                    <Link to="/" search={{ cat: c.id }} onClick={onNavigate} className={cn("flex h-9 items-center justify-between gap-3 border-l-2 pl-5 text-sm", activeCat === c.id ? "border-accent text-accent" : "border-transparent text-muted hover:text-fg")}>
                      <span>{c.label}</span>
                      <span className="font-mono text-xs text-sniper">{counts[c.id] ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="sticky top-28 hidden max-h-[calc(100dvh-8rem)] w-64 shrink-0 self-start overflow-y-auto border-r border-line pr-5 md:block">
      <CategoryNav />
    </aside>
  );
}
