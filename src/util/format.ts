const AVATAR_COLORS = ['#F4A261', '#2FD4C0', '#E76F51', '#8AB4F8', '#F4D35E', '#B983FF'];

/** Initials from a display name, e.g. "Rohan Mehta" -> "RM". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}

/** Deterministic avatar background color, stable across sessions for a given id. */
export function avatarColorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** e.g. "15 Jul" */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** e.g. "15 Jul 2026" */
export function longDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** e.g. "3h ago", "5d ago", or a short date once it's over a week old. */
export function timeAgo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const seconds = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return shortDate(iso);
}

/** Format a number as Indian-grouped rupees, e.g. 32000 -> "₹32,000". */
export function rupees(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(Math.round(amount));
  // Indian grouping: last 3 digits, then groups of 2.
  const s = String(abs);
  let out = s;
  if (s.length > 3) {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    out = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  return `${sign}₹${out}`;
}
