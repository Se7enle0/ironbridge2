import { Link } from "@tanstack/react-router";
import { Price } from "@/components/price";
import { Stamp } from "@/components/stamp";
import { isSilencer, type Product } from "@/lib/catalog";

export function ListingCard({ product }: { product: Product }) {
  return (
    <Link
      to="/item/$id"
      params={{ id: product.id }}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-line bg-surface shadow-panel transition-[box-shadow,border-color] duration-150 hover:shadow-panel-hover"
    >
      <span className="absolute inset-y-0 left-0 w-0.5 bg-accent" aria-hidden="true" />
      <div className="relative aspect-square bg-paper">
        <img src={product.photo} alt={product.title} className="h-full w-full object-cover" />
        {isSilencer(product.category) ? (
          <Stamp className="absolute right-2 top-2 bg-bg/80">NFA</Stamp>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col border-t border-line p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">{product.maker}</p>
        <h3 className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-fg group-hover:text-accent">
          {product.title}
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-sniper">
          IB-{product.id.slice(-10).toUpperCase()}
        </p>
        <div className="mt-auto pt-3">
          <Price street={product.price} />
        </div>
      </div>
    </Link>
  );
}

export function ListingGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}
