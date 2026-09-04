import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { predict, type SearchHit } from "@/lib/search";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const nav = useNavigate();
  const listId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const hits = useMemo(() => predict(q), [q]);
  const show = open && q.trim().length > 0;
  useEffect(() => { setHi(0); }, [q]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const go = (hit?: SearchHit) => {
    const pick = hit ?? hits[hi];
    setOpen(false);
    if (!pick) { const query = q.trim(); if (!query) return; void nav({ to: "/", search: { q: query } }); return; }
    if (pick.kind === "item") { void nav({ to: "/item/$id", params: { id: pick.id } }); return; }
    if (pick.kind === "aisle") { void nav({ to: "/", search: { cat: pick.id } }); return; }
    if (pick.kind === "dept") { void nav({ to: "/", search: { group: pick.id } }); return; }
    void nav({ to: "/", search: { q: pick.label } });
  };
  return (
    <div ref={wrap} className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sniper" />
      <Input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setHi((i) => Math.min(hits.length - 1, i + 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setHi((i) => Math.max(0, i - 1)); }
          else if (e.key === "Enter") { e.preventDefault(); go(); }
          else if (e.key === "Escape") { setOpen(false); }
        }}
        placeholder="Search barrels, ComTac, Magpul, boots…" aria-label="Search the depot" aria-autocomplete="list" aria-controls={listId} aria-expanded={show} className="pl-10" role="combobox" />
      {show ? (
        <ul id={listId} role="listbox" className="absolute z-50 mt-1 max-h-96 w-full overflow-auto border border-line bg-surface shadow-panel">
          {hits.length === 0 ? (
            <li className="px-3 py-3 text-sm text-muted">Nothing matches “{q.trim()}”. Enter to search the rack.</li>
          ) : hits.map((hit, i) => (
            <li key={`${hit.kind}-${hit.id}`} role="option" aria-selected={i === hi}>
              <button type="button" className={cn("flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm", i === hi ? "bg-elevated text-fg" : "text-fg hover:bg-elevated")} onMouseEnter={() => setHi(i)} onClick={() => go(hit)}>
                {hit.kind === "item" ? <img src={hit.photo} alt="" className="size-10 shrink-0 object-cover bg-paper" /> : (
                  <span className="grid size-10 shrink-0 place-items-center border border-line bg-elevated font-mono text-xs uppercase text-accent">{hit.kind === "dept" ? "DP" : hit.kind === "aisle" ? "AL" : "MK"}</span>
                )}
                <span className="min-w-0"><span className="block truncate font-medium">{hit.label}</span><span className="block truncate text-xs uppercase tracking-[0.14em] text-sniper">{hit.hint}</span></span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
