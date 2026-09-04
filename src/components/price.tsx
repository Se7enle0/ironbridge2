import { money } from "@/lib/catalog";
import { earnOnTicket, responderPrice, ticketPrice } from "@/lib/pricing";
import { useService } from "@/lib/service";
import { cn } from "@/lib/utils";

export function Price({
  street,
  size = "md",
  className,
}: {
  street: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const service = useService((s) => s.claimed);
  const ticket = ticketPrice(street, service);
  const mil = responderPrice(street);
  const { points, worth } = earnOnTicket(ticket);
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-2",
        size === "lg" && "font-display",
        className,
      )}
    >
      <span
        className={cn(
          "font-semibold text-accent",
          size === "sm" && "text-sm",
          size === "md" && "text-sm",
          size === "lg" && "text-4xl",
        )}
      >
        {money(ticket)}
      </span>
      <span className={cn("text-sniper line-through", size === "lg" ? "text-base" : "text-xs")}>
        {money(street)}
      </span>
      <span className="text-xs uppercase tracking-[0.16em] text-fg">
        {service ? "Service 15%" : "5% under"}
      </span>
      {service ? null : (
        <span className="w-full text-xs text-muted">
          Military / police / first responder {money(mil)}
        </span>
      )}
      {size === "lg" ? (
        <span className="mt-4 w-full border border-accent/50 bg-elevated p-4 font-sans">
          <span className="block text-xs uppercase tracking-[0.18em] text-accent">Bridge points</span>
          <span className="mt-2 block text-lg font-semibold normal-case tracking-normal text-fg">
            Earn {points.toLocaleString()} pts
          </span>
          <span className="mt-1 block text-sm font-normal normal-case tracking-normal text-muted">
            Those {points.toLocaleString()} points convert to {money(worth)} at checkout (100 pts = $3.00).
          </span>
          <span className="mt-2 block text-xs font-normal uppercase tracking-[0.16em] text-sniper">
            $100 spent → 1,000 pts · 100 pts → $3.00
          </span>
        </span>
      ) : (
        <span className="w-full text-xs text-fg">
          Earn {points.toLocaleString()} pts · worth {money(worth)}
        </span>
      )}
    </span>
  );
}
