// PAGE-001 (`/`). MM.DDYY date parser shared by BOND and DATE — TASK-184, TASK-196.
// TI BA II Plus Pro convention: 4-digit YYYY in display; entered as MM.DDYY
// where YY 0..49 ⇒ 20YY and YY 50..99 ⇒ 19YY (per guidebook).
export const parseDateInput = (raw) => {
  if (raw == null || !Number.isFinite(raw)) return null;
  if (raw <= 0 || raw >= 14) return null;
  const text = raw.toFixed(4);
  const [mmRaw, frac] = text.split('.');
  const mm = Number(mmRaw);
  if (!Number.isInteger(mm) || mm < 1 || mm > 12) return null;
  const dd = Number(frac.slice(0, 2));
  const yy = Number(frac.slice(2, 4));
  if (dd < 1 || dd > 31) return null;
  const year = yy <= 49 ? 2000 + yy : 1900 + yy;
  // Validate calendar day for month / leap year
  const daysInMonth = new Date(year, mm, 0).getDate();
  if (dd > daysInMonth) return null;
  return { year, month: mm, day: dd };
};

export const formatDate = (d) => {
  if (!d) return '';
  return `${d.month}-${String(d.day).padStart(2, '0')}-${d.year}`;
};
