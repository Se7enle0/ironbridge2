import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { money } from "@/lib/catalog";
import { quoteShipping, SHIP_METHODS, useShip } from "@/lib/shipping";
import { cn } from "@/lib/utils";

export function ShipCalc({ subtotal, nfa = false, zipId = "ship-zip", hideZip = false }: { subtotal: number; nfa?: boolean; zipId?: string; hideZip?: boolean; }) {
  const zip = useShip((s) => s.zip);
  const method = useShip((s) => s.method);
  const setZip = useShip((s) => s.setZip);
  const setMethod = useShip((s) => s.setMethod);
  const quote = quoteShipping({ subtotal, zip, method, nfa });
  return (
    <div className="rounded-sm border border-line bg-surface p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-subtle">Shipping calculator</p>
      <p className="mt-2 text-sm text-muted">From Orlando. Ground and 2-day are free at $150. Overnight is free on tickets of $1,500 or more.{nfa ? " Under $150, NFA cans add a $15 FFL box." : ""}</p>
      {hideZip ? null : (<><Label htmlFor={zipId} className="mt-4">ZIP</Label><Input id={zipId} inputMode="numeric" autoComplete="postal-code" placeholder="32801" value={zip} onChange={(e) => setZip(e.target.value)} className="mt-2 max-w-40" /></>)}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {SHIP_METHODS.map((m) => {
          const q = quoteShipping({ subtotal, zip, method: m.id, nfa });
          const on = method === m.id;
          return (
            <label key={m.id} className={cn("flex min-h-11 cursor-pointer flex-col gap-1 rounded-sm border px-4 py-3 transition-[border-color] duration-150", on ? "border-accent bg-elevated" : "border-line bg-elevated hover:border-sniper")}>
              <input type="radio" name={`ship-${zipId}`} value={m.id} checked={on} onChange={() => setMethod(m.id)} className="sr-only" />
              <span className="font-display text-lg uppercase tracking-wide text-fg">{m.label}</span>
              <span className="text-sm text-fg">{q.ready ? (q.cents === 0 && subtotal > 0 ? "Free" : money(q.cents)) : "—"}</span>
              <span className="text-xs text-subtle">{q.ready ? q.eta : m.hint}</span>
            </label>
          );
        })}
      </div>
      {quote.ready ? (
        <p className="mt-4 text-sm text-muted">{quote.zone}. {quote.free ? (quote.method === "overnight" ? "Overnight waived at $1,500. " : "Ship waived over $150. ") : quote.method === "overnight" ? "Overnight free at $1,500. " : null}{quote.nfaFee > 0 ? `FFL box ${money(quote.nfaFee)}. ` : null}Ships {quote.eta}.</p>
      ) : (
        <p className="mt-4 text-sm text-subtle">Enter a 5-digit ZIP to quote a box.</p>
      )}
    </div>
  );
}
