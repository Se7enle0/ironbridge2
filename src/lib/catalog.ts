export type Product = {
  id: string;
  title: string;
  maker: string;
  description: string;
  category: string;
  price: number;
  qty: number;
  photo: string;
  featured?: boolean;
  facts?: string[];
};

export const CATEGORIES: { id: string; label: string; group: string }[] = [
  { id: "mens-pants", label: "Men's pants", group: "Clothes" },
  { id: "womens-pants", label: "Women's pants", group: "Clothes" },
  { id: "jackets", label: "Jackets", group: "Clothes" },
  { id: "parkas", label: "Parkas", group: "Clothes" },
  { id: "underwear", label: "Underwear", group: "Clothes" },
  { id: "hats", label: "Hats", group: "Clothes" },
  { id: "mens-boots", label: "Men's boots", group: "Boots" },
  { id: "womens-boots", label: "Women's boots", group: "Boots" },
  { id: "red-dots", label: "Red dots", group: "Optics" },
  { id: "holographic", label: "Holographic", group: "Optics" },
  { id: "lpvo", label: "LPVOs", group: "Optics" },
  { id: "scopes", label: "Rifle scopes", group: "Optics" },
  { id: "thermal", label: "Thermal", group: "Optics" },
  { id: "night-vision", label: "Night vision", group: "Optics" },
  { id: "silencers-556", label: "5.56 / .223", group: "Silencers" },
  { id: "silencers-30", label: ".30 cal / 7.62", group: "Silencers" },
  { id: "silencers-9", label: "9mm pistol", group: "Silencers" },
  { id: "silencers-45", label: ".45 / 10mm", group: "Silencers" },
  { id: "silencers-rimfire", label: "Rimfire .22", group: "Silencers" },
  { id: "silencers-multi", label: "Multi-caliber", group: "Silencers" },
  { id: "silencers-large", label: "Large bore", group: "Silencers" },
  { id: "silencers-shotgun", label: "Shotgun", group: "Silencers" },
  { id: "muzzle-brakes", label: "Muzzle brakes", group: "Rifle parts" },
  { id: "barrels", label: "Barrels", group: "Rifle parts" },
  { id: "barrel-nuts", label: "Barrel nuts", group: "Rifle parts" },
  { id: "rails", label: "Rails & handguards", group: "Rifle parts" },
  { id: "vertical-grips", label: "Vertical grips", group: "Rifle parts" },
  { id: "angled-grips", label: "Angled grips", group: "Rifle parts" },
  { id: "stocks", label: "Stocks", group: "Rifle parts" },
  { id: "braces", label: "Braces", group: "Rifle parts" },
  { id: "triggers", label: "Triggers", group: "Rifle parts" },
  { id: "bcgs", label: "Bolt carrier groups", group: "Rifle parts" },
  { id: "charging-handles", label: "Charging handles", group: "Rifle parts" },
  { id: "magazines", label: "Magazines", group: "Rifle parts" },
  { id: "lights", label: "Weapon lights", group: "Rifle parts" },
  { id: "slings", label: "Slings", group: "Rifle parts" },
  { id: "pistol-grips", label: "Pistol grips", group: "Pistol & shotgun" },
  { id: "holsters", label: "Holsters", group: "Pistol & shotgun" },
  { id: "pistol-parts", label: "Pistol accessories", group: "Pistol & shotgun" },
  { id: "shotgun-parts", label: "Shotgun accessories", group: "Pistol & shotgun" },
  { id: "mg-parts", label: "MG accessories", group: "Pistol & shotgun" },
  { id: "cb-radios", label: "CB radios", group: "Comms & eyepro" },
  { id: "handheld-radios", label: "Handheld radios", group: "Comms & eyepro" },
  { id: "sunglasses", label: "Sunglasses", group: "Comms & eyepro" },
  { id: "ballistic-glasses", label: "Ballistic glasses", group: "Comms & eyepro" },
  { id: "ear-over", label: "Over-ear hearing", group: "Hearing" },
  { id: "ear-in", label: "In-ear hearing", group: "Hearing" },
  { id: "helmets", label: "Ballistic helmets", group: "Armor & loadout" },
  { id: "armor-iiia", label: "Soft armor IIIA", group: "Armor & loadout" },
  { id: "armor-iii", label: "Rifle plates III", group: "Armor & loadout" },
  { id: "armor-iv", label: "Rifle plates IV", group: "Armor & loadout" },
  { id: "plate-carriers", label: "Plate carriers", group: "Armor & loadout" },
  { id: "belts", label: "Tactical belts", group: "Armor & loadout" },
  { id: "mag-pouches", label: "Mag pouches", group: "Armor & loadout" },
  { id: "packs", label: "Packs & bags", group: "Armor & loadout" },
  { id: "ifak", label: "Medical kits", group: "Medical" },
  { id: "med-supplies", label: "Medical supplies", group: "Medical" },
];

export function groupSlug(group: string) {
  return group.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const NAV_GROUPS = [...new Set(CATEGORIES.map((c) => c.group))].map((group) => ({
  group,
  slug: groupSlug(group),
  items: CATEGORIES.filter((c) => c.group === group),
}));

export function groupBySlug(slug: string) {
  return NAV_GROUPS.find((g) => g.slug === slug);
}

export function categoryIdsForGroup(slug: string) {
  return groupBySlug(slug)?.items.map((c) => c.id) ?? [];
}

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function groupLabel(slug: string) {
  return groupBySlug(slug)?.group ?? slug;
}

export function isSilencer(category: string) {
  return category.startsWith("silencers-");
}

export { PRODUCTS } from "./inventory";
export { getProduct, featuredProducts, countByCategory } from "./inventory";
