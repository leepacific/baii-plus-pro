import { describe, expect, it } from 'vitest';
import { createProfitWorksheet } from './profit-mode';

describe('PROFIT worksheet (REQ-018)', () => {
  it('opens with CST slot focused and CPTs remaining slot from the other two', () => {
    const ws = createProfitWorksheet();
    expect(ws.view().label).toBe('CST');
    // Enter CST = 80 at CST slot.
    ws.press({ kind: 'digit', value: 8 });
    ws.press({ kind: 'digit', value: 0 });
    ws.press({ kind: 'enter' });
    expect(ws.state.CST).toBe(80);
    // Move to SEL, enter SEL = 100.
    ws.press({ kind: 'arrow', dir: 'down' });
    expect(ws.view().label).toBe('SEL');
    ws.press({ kind: 'digit', value: 1 });
    ws.press({ kind: 'digit', value: 0 });
    ws.press({ kind: 'digit', value: 0 });
    ws.press({ kind: 'enter' });
    expect(ws.state.SEL).toBe(100);
    // Move to MAR, CPT — expect 20.
    ws.press({ kind: 'arrow', dir: 'down' });
    expect(ws.view().label).toBe('MAR');
    ws.press({ kind: 'cpt' });
    expect(ws.state.MAR).toBeCloseTo(20, 6);
  });
});
