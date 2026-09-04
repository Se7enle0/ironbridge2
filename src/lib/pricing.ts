export const STREET_CUT = 0.95;
export const SERVICE_CUT = 0.85;
export const POINTS_PER_DOLLAR = 10;
export const CENTS_PER_POINT = 3;
export const POINT_BLOCK = 100;

export function ourPrice(streetCents: number) {
  return Math.round(streetCents * STREET_CUT);
}

export function responderPrice(streetCents: number) {
  return Math.round(ourPrice(streetCents) * SERVICE_CUT);
}

export function ticketPrice(streetCents: number, service: boolean) {
  return service ? responderPrice(streetCents) : ourPrice(streetCents);
}

export function savedCents(streetCents: number) {
  return streetCents - ourPrice(streetCents);
}

export function pointsFromSpend(paidCents: number) {
  return Math.floor(Math.max(0, paidCents) / 10);
}

export function redeemValue(points: number) {
  return points * CENTS_PER_POINT;
}

export function earnOnTicket(paidCents: number) {
  const points = pointsFromSpend(paidCents);
  return { points, worth: redeemValue(points) };
}

export function maxRedeemable(balance: number, payableCents: number) {
  const byValue = Math.floor(Math.max(0, payableCents) / CENTS_PER_POINT);
  const raw = Math.min(Math.max(0, balance), byValue);
  return Math.floor(raw / POINT_BLOCK) * POINT_BLOCK;
}
