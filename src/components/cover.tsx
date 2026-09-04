import { Button } from "@/components/ui/button";
import { Stamp } from "@/components/stamp";
import { BRAND } from "@/lib/brand";

export function CoverHero() {
  return (
    <section className="relative isolate min-h-cover overflow-hidden border-b border-line">
      <img
        src="/cover.jpg"
        alt="Arched iron bridge spanning a mountain gorge"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/35 to-transparent" />
      <div className="relative flex min-h-cover flex-col justify-between px-1 py-10 lg:py-14">
        <div className="flex justify-end">
          <div className="border border-accent bg-bg/70 px-4 py-3 text-right backdrop-blur-sm">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              Surplus depot
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-fg">
              {BRAND.city} · {BRAND.state} · Private issue
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-sniper">Not a U.S. Government site</p>
          </div>
        </div>
        <div>
          <Stamp>{BRAND.origin}</Stamp>
          <h1 className="mt-4 font-display text-5xl font-bold text-fg sm:text-7xl lg:text-8xl">{BRAND.name}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg">{BRAND.tagline}</p>
          <p className="mt-3 max-w-xl text-sm uppercase tracking-[0.18em] text-accent">
            Military, police & first responders — 15% off everything
          </p>
          <Button asChild size="lg" className="mt-8 w-fit">
            <a href="#floor">Enter the depot</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
