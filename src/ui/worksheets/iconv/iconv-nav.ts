// PAGE-001 (`/`). ICONV slot navigation — TASK-181.
export type IconvSlot = 'NOM' | 'EFF' | 'C/Y';

const ORDER: IconvSlot[] = ['NOM', 'EFF', 'C/Y'];

export const advanceIconvFocus = (current: IconvSlot, dir: 'up' | 'down'): IconvSlot | null => {
  const i = ORDER.indexOf(current);
  if (i < 0) return null;
  const next = dir === 'down' ? i + 1 : i - 1;
  if (next < 0 || next >= ORDER.length) return null;
  return ORDER[next];
};
