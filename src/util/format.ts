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
