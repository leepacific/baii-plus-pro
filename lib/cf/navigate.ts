export const CF_FOCUS_ORDER = ['CF0', ...Array.from({ length: 24 }, (_, i) => [`CF${String(i + 1).padStart(2, '0')}`, `F${String(i + 1).padStart(2, '0')}`]).flat()];
export const moveCfFocus = (current: string, direction: 'up'|'down'): string => {
  const i = CF_FOCUS_ORDER.indexOf(current);
  const offset = direction === 'down' ? 1 : -1;
  return CF_FOCUS_ORDER[(i + offset + CF_FOCUS_ORDER.length) % CF_FOCUS_ORDER.length];
};
