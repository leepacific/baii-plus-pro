export type MemoryRegister = `M${0|1|2|3|4|5|6|7|8|9}`;
export type MemoryState = Record<MemoryRegister, number>;
export const MEMORY_REGISTERS: MemoryRegister[] = ['M0','M1','M2','M3','M4','M5','M6','M7','M8','M9'];
export const initialMemoryState = (): MemoryState => Object.fromEntries(MEMORY_REGISTERS.map((r) => [r, 0])) as MemoryState;
export const slotName = (slot: number): MemoryRegister => {
  if (!Number.isInteger(slot) || slot < 0 || slot > 9) throw new RangeError('memory slot');
  return `M${slot}` as MemoryRegister;
};
