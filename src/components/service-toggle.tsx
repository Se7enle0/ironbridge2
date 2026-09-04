import { useService } from "@/lib/service";

export function ServiceToggle() {
  const claimed = useService((s) => s.claimed);
  const setClaimed = useService((s) => s.setClaimed);
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border border-line bg-surface p-4 has-[:checked]:border-accent">
      <input
        type="checkbox"
        className="mt-1 size-4 shrink-0 accent-accent"
        checked={claimed}
        onChange={(e) => setClaimed(e.target.checked)}
      />
      <span>
        <span className="block font-display text-lg uppercase tracking-wide text-fg">
          Military, police, first responder
        </span>
        <span className="mt-1 block text-sm text-muted">
          15% off the IRONBRIDGE ticket. Honor system on this demo — no ID check.
        </span>
      </span>
    </label>
  );
}
