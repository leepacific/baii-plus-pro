// PAGE-001 (`/`). CF arrow navigation — TASK-177.
// Sequence: CFo, C01, F01, C02, F02, ..., C24, F24. No wrap.
export type CfSlot = 'CFo' | `C${string}` | `F${string}`;

const buildOrder = (): CfSlot[] => {
  const order: CfSlot[] = ['CFo'];
  for (let i = 1; i <= 24; i++) {
    const idx = String(i).padStart(2, '0');
    order.push(`C${idx}` as CfSlot);
    order.push(`F${idx}` as CfSlot);
  }
  return order;
};

const ORDER = buildOrder();

export const advanceCfFocus = (current: CfSlot, dir: 'up' | 'down'): CfSlot | null => {
  const i = ORDER.indexOf(current);
  if (i < 0) return null;
  const next = dir === 'down' ? i + 1 : i - 1;
  if (next < 0 || next >= ORDER.length) return null;
  return ORDER[next];
};
