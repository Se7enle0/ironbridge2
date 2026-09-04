import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" className="fill-elevated" />
      <rect x="0.5" y="0.5" width="31" height="31" className="fill-none stroke-accent" strokeWidth="1" />
      <path d="M3 23 L9 14 L13 19 L17 11 L23 17 L29 13 V25 H3 Z" className="fill-accent opacity-40" />
      <path d="M5 22 Q16 6 27 22" className="fill-none stroke-fg" strokeWidth="1.7" />
      <path d="M4 22 H28" className="stroke-fg" strokeWidth="1.5" />
      <path d="M11 22 V13.4 M16 22 V7.8 M21 22 V13.4" className="stroke-fg" strokeWidth="1.1" />
      <path d="M6 22 V27 M26 22 V27" className="stroke-accent" strokeWidth="1.6" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-[0.2em] text-fg">{BRAND.short}</span>
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.24em] text-accent">
          Surplus · {BRAND.city}
        </span>
      </span>
    </span>
  );
}
