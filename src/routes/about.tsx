import { createFileRoute } from "@tanstack/react-router";
import { Page, Eyebrow } from "@/components/page";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <Page className="max-w-2xl px-0">
      <Eyebrow>The desk</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-fg">What we sell</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {BRAND.name} is a private surplus catalog in {BRAND.city} — born and bred in the USA. The floor is modeled on the big accessory
        houses — OpticsPlanet, Brownells — clothes on one wall, parts and glass on the other, and a
        full Silencer Shop–style can board. Every ticket is 5% under those street prices. Military,
        police, and first responders take another 15% off. {BRAND.origin}.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Tactical pants, boots, jackets, parkas, underwear, and hats for men and women. Firearm
        accessories for pistols, rifles, shotguns, and crew-served guns. Optics from red dots through thermal and night vision. Over-ear and in-ear hearing. Ballistic helmets and armor — NIJ IIIA, Level III, and Level IV plates. Plate carriers, belts, mag pouches, IFAKs. Packs from 5.11, Vanquest, and Vertx.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Silencers from the Silencer Shop wall. Each can is an NFA item: 21+, Form 4 / eForms, Florida-legal. The FFL transfer desk is not wired yet.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Bridge points: every $100 you actually pay earns 1,000 points. 100 points knocks $3 off a later bag. Demo only — no live payment.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Shipping from Orlando. Ground and 2-day free at $150. Overnight free at $1,500.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">We do not sell complete firearms.</p>
    </Page>
  );
}
