import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Stamp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex border border-accent px-2 py-0.5 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
