import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { Page, Eyebrow } from "@/components/page";
import { Price } from "@/components/price";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NFA_NOTICE } from "@/lib/brand";
import { categoryLabel, getProduct, isSilencer, money } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ticketPrice } from "@/lib/pricing";
import { useService } from "@/lib/service";

export const Route = createFileRoute("/item/$id")({
  component: ItemPage,
});

function ItemPage() {
  const { id } = Route.useParams();
  const product = getProduct(id);
  const add = useCart((s) => s.add);
  const service = useService((s) => s.claimed);
  if (!product) throw notFound();
  const nfa = isSilencer(product.category);
  const ticket = ticketPrice(product.price, service);

  return (
    <Page className="px-0">
      <Link to="/" className="text-sm text-muted hover:text-fg">← Catalog</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-sm border border-line bg-paper shadow-panel">
          <img src={product.photo} alt={product.title} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <Eyebrow>{product.maker}</Eyebrow>
          <h1 className="mt-2 font-display text-4xl normal-case tracking-normal text-fg">{product.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{categoryLabel(product.category)}</Badge>
            <Badge tone="accent">{product.maker}</Badge>
            {nfa ? <Badge tone="danger">NFA · Form 4</Badge> : null}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>
          {nfa ? <p className="mt-6 rounded-md border border-line bg-elevated px-4 py-3 text-sm leading-relaxed text-muted">{NFA_NOTICE}</p> : null}
          <div className="mt-8"><Price street={product.price} size="lg" /></div>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-subtle">{product.qty} on the shelf</p>
          <Button className="mt-8 w-full sm:w-auto" onClick={() => { const r = add(product.id); toast(r.message); }}>Add to bag · {money(ticket)}</Button>
        </div>
      </div>
    </Page>
  );
}
