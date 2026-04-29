export interface CalcDate { year: number; month: number; day: number }
export const parseMmDdYy = (value: number): CalcDate => {
  const text = value.toFixed(4);
  const [mm, ddyy] = text.split('.');
  const dd = Number(ddyy.slice(0, 2));
  const yy = Number(ddyy.slice(2, 4));
  return { year: 2000 + yy, month: Number(mm), day: dd };
};
