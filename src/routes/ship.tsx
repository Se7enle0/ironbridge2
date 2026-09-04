import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page, Eyebrow } from "@/components/page";
import { ShipCalc } from "@/components/ship-calc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartSubtotal, resolveCart, useCart } from "@/lib/cart";
import { isSilencer, money } from "@/lib/catalog";
import { useService } from "@/lib/service";
import { quoteShipping, useShip } from "@/lib/shipping";

export const Route = createFileRoute("/ship")({ component: ShipPage });

function ShipPage() {
  const hydrateCart = useCart((s) => s.hydrate);
  const hydrateShip = useShip((s) => s.hydrate);
  const hydrateService = useService((s) => s.hydrate);
  const items = useCart((s) => s.items);
  const zip = useShip((s) => s.zip);
  const method = useShip((s) => s.method);
  const service = useService((s) => s.claimed);
  const lines = resolveCart(items);
  const bag = cartSubtotal(items, service);
  const nfa = lines.some((l) => isSilencer(l.listing.category));
  const [est, setEst] = useState("");
  const estimate = Math.round(Number(est.replace(/[^0-9.]/g, "")) * 100);
  const subtotal = bag > 0 ? bag : Number.isFinite(estimate) && estimate > 0 ? estimate : 0;
  const quote = quoteShipping({ subtotal, zip, method, nfa });

  useEffect(() => { hydrateCart(); hydrateShip(); hydrateService(); }, [hydrateCart, hydrateShip, hydrateService]);

  return (
    <Page className="max-w-3xl px-0">
      <Eyebrow>Shipping</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-fg">Quote a box</h1>
      <p className="mt-3 text-sm text-muted">Rates from the Orlando desk. Ground and 2-day free at $150. Overnight free at $1,500.</p>
      {bag > 0 ? <p className="mt-4 text-sm text-muted">Using your bag · {money(bag)}</p> : (
        <div className="mt-6 grid gap-2">
          <Label htmlFor="est">Estimate a ticket</Label>
          <Input id="est" inputMode="decimal" placeholder="150.00" value={est} onChange={(e) => setEst(e.target.value)} className="max-w-40" />
        </div>
      )}
      <div className="mt-6"><ShipCalc subtotal={subtotal} nfa={nfa} zipId="quote-zip" /></div>
      {quote.ready && subtotal > 0 ? <p className="mt-6 font-display text-2xl text-fg">Ship {money(quote.cents)} · door {money(subtotal + quote.cents)}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {bag > 0 ? <Button asChild><Link to="/checkout">Checkout</Link></Button> : <Button asChild><Link to="/" search={{}}>Catalog</Link></Button>}
      </div>
    </Page>
  );
}
