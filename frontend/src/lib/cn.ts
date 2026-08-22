type ClassValue = string | number | null | boolean | undefined;

/**
 * Minimal className joiner (no dependency on clsx/tailwind-merge — not yet
 * justified by Phase 1/2 docs, see TF-OQ-004). Swap for tailwind-merge if
 * conditional/conflicting Tailwind classes become common enough to need it.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
