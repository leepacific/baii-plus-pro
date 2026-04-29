import { describe, expect, it } from 'vitest';
import { createBreakevenWorksheet } from './bep-mode';

describe('BREAKEVEN worksheet (REQ-019)', () => {
  it('opens with FC slot focused and CPTs Q from FC/VC/P/PFT', () => {
    const ws = createBreakevenWorksheet();
    expect(ws.view().label).toBe('FC');
    // FC = 1000.
    ws.press({ kind: 'digit', value: 1 });
    ws.press({ kind: 'digit', value: 0 });
    ws.press({ kind: 'digit', value: 0 });
    ws.press({ kind: 'digit', value: 0 });
    ws.press({ kind: 'enter' });
    expect(ws.state.FC).toBe(1000);
    // VC = 5.
    ws.press({ kind: 'arrow', dir: 'down' });
    ws.press({ kind: 'digit', value: 5 });
    ws.press({ kind: 'enter' });
    // P = 10.
    ws.press({ kind: 'arrow', dir: 'down' });
    ws.press({ kind: 'digit', value: 1 });
    ws.press({ kind: 'digit', value: 0 });
    ws.press({ kind: 'enter' });
    // PFT = 0.
    ws.press({ kind: 'arrow', dir: 'down' });
    ws.press({ kind: 'digit', value: 0 });
    ws.press({ kind: 'enter' });
    // Q: CPT — (1000 + 0) / (10 - 5) = 200.
    ws.press({ kind: 'arrow', dir: 'down' });
    expect(ws.view().label).toBe('Q');
    ws.press({ kind: 'cpt' });
    expect(ws.state.Q).toBe(200);
  });
});
