// PAGE-001 (`/`). Application entrypoint — TASK-052.
// Mounts chassis SVG, keypad, LCD render, footer, help affordance, and wires
// touch + keyboard handlers into the dispatcher (engine + worksheet controller).
import './styles/tokens.css';
import './styles/device.css';
import './styles/keypad.css';
import './styles/lcd.css';
import './styles/orientation.css';
import './styles/fonts.css';
import './ui/keypad.css';
import './ui/keymap-modal.css';
import './ui/help-affordance.css';
import './ui/worksheets/bond-worksheet.css';
import './ui/worksheets/depr-worksheet.css';
import './ui/worksheets/date-worksheet.css';
import './ui/worksheets/stat-worksheet.css';

import { createEngine } from './engine/index';
import { KeyId } from './keypad/key-id';
import { renderChassis } from './ui/chassis';
import { renderKeypad } from './ui/render-keypad';
import { initLcd } from './ui/lcd';
import { renderDisplay } from './ui/render-display';
import { renderFooter } from './ui/footer';
import { renderRotateOverlay } from './ui/rotate-overlay';
import { renderHelpAffordance } from './ui/help-affordance';
import { renderKeymapModal } from './ui/keymap-modal';
import { attachTouchHandler } from './ui/touch-handler';
import { attachKeyboardHandler } from './ui/keyboard-handler';
import { createWorksheetController, type WorksheetAction } from './ui/worksheets/controller';
import { createAmortWorksheet } from './ui/worksheets/amort/AmortWorksheet';
import { createCfWorksheet } from './ui/worksheets/cf/CfWorksheet';
import { createIconvWorksheet } from './ui/worksheets/iconv/IconvWorksheet';
import { createBondWorksheet } from './ui/worksheets/bond-worksheet.js';
import { createDeprWorksheet } from './ui/worksheets/depr-worksheet.js';
import { createDateWorksheet } from './ui/worksheets/date-worksheet.js';
import { createStatWorksheet } from './ui/worksheets/stat-worksheet.js';
import { createProfitWorksheet } from './ui/worksheets/profit/ProfitWorksheet';
import { createBreakevenWorksheet } from './ui/worksheets/bep/BreakevenWorksheet';
import { createMemWorksheet } from './worksheets/mem';
import { createKeypadHandler } from './ui/keypad-handler';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app missing');

// 1. Mount rotate overlay (DOM order: overlay first so it stacks above everything).
app.appendChild(renderRotateOverlay());

// 2. Mount stage + chassis SVG.
const stage = document.createElement('div');
stage.className = 'stage';
app.appendChild(stage);
const svg = renderChassis(stage);

// 3. Render keypad keys into the chassis SVG.
renderKeypad(svg);

// 4. Initialize LCD bindings.
initLcd(svg);

// 5. Engine + worksheet controller.
// initiallyPowered: false — boots OFF (LCD blank) per physical BA II Plus
// behavior. User presses ON|OFF to power on.
const engine = createEngine({ initiallyPowered: false });
const controller = createWorksheetController();

// Expose memory state R/W to the keypad handler (STO/RCL).
let memoryRef = engine.getState().memory;
const keypadHandler = createKeypadHandler({
  getMemory: () => memoryRef,
  setMemory: (m) => { memoryRef = m; },
  getDisplay: () => engine.getState().display.value,
  // RCL writes the recalled register value directly onto the engine display.
  // Previously this was wired to a never-read local `sideRegister`, leaving
  // RCL effectively non-functional end-to-end (REQ-021 fix).
  setDisplay: (n) => { engine.setDisplayValue(n); },
});

// Virtual key ids used by the chassis SVG for keys absent from KeyId enum.
const V_CF = 'V_CF';
const V_NPV = 'V_NPV';
const V_IRR = 'V_IRR';
// Scientific-row virtual ids — chassis primary keycaps that map to ops not
// in the KeyId enum (REQ-007 fix).
const V_YX = 'V_YX';        // primary "yˣ" (binary y^x — routes to KeyId.POWER)
const V_RECIP = 'V_RECIP';  // primary "1/x" (unary RECIPROCAL)
const V_LN = 'V_LN';        // primary "LN" (unary natural log)
const SCIENTIFIC_VIRTUAL_KEYS = new Set([V_YX, V_RECIP, V_LN]);

// Primary (no-2ND) entry for CF/NPV/IRR keys: pressing CF opens the CF
// worksheet directly; NPV/IRR pressed primary route into CF Pro sub-modes.
// Pressing CF/NPV/IRR with the 2ND latch DOES NOT enter these worksheets;
// instead 2ND+CF=P/Y, 2ND+NPV=AMORT, 2ND+IRR=BGN (see tryEnterWorksheet).
const tryEnterPrimaryWorksheet = (keyId: string): boolean => {
  if (keyId === V_CF) { controller.enter(createCfWorksheet()); return true; }
  return false;
};

// 2ND-mapped worksheet entry — canonical 2ND-prefix table:
//   2ND+NPV (V_NPV) → AMORT       (NPV legend is "AMORT")
//   2ND+CF  (V_CF)  → P/Y settings (no-op stub for v1)
//   2ND+IRR (V_IRR) → BGN/END toggle (handled inline below — REQ-010 fix)
//   2ND+PMT         → BGN sub-label (alternate path on PMT key)
//   2ND+1 → DATE          2ND+2 → ICONV         2ND+3 → PROFIT (REQ-018 fix)
//   2ND+4 → DEPR          2ND+6 → BRKEVN (REQ-019 fix)        2ND+8 → STAT
//   2ND+9 → BOND          2ND+0 → MEM
const tryEnterWorksheet = (keyId: string): boolean => {
  const second = engine.getState().secondLatched;
  if (!second) return false;
  // 2ND+IRR → BGN/END toggle. Inline state flip on engine.tvm.timing — the
  // BGN indicator on the LCD reads engine.state.tvm.timing on next render
  // (REQ-010 fix). We use the dispatcher-level BGN toggle path used for
  // 2ND+ARROW_UP by issuing a synthetic ARROW_UP press while 2ND is latched;
  // the dispatcher consumes the latch and flips tvm.timing.
  if (keyId === V_IRR) {
    engine.pressKey(KeyId.ARROW_UP);
    return true;
  }
  // 2ND+NPV → AMORT (canonical: NPV legend is "AMORT").
  if (keyId === V_NPV) { controller.enter(createAmortWorksheet(engine)); return true; }
  // 2ND+CF → P/Y settings worksheet. v1: no dedicated worksheet exists yet;
  // fall back to the basic CF worksheet which exposes CFo entry. Documenting
  // this as a partial coverage point for REQ-010 (P/Y); full P/Y entry is
  // deferred to a follow-up because the lib exists (lib/tvm/py-field) but no
  // dedicated UI shell does.
  if (keyId === V_CF) { controller.enter(createCfWorksheet()); return true; }
  if (keyId === KeyId.D1) { controller.enter(createDateWorksheet() as never); return true; }
  if (keyId === KeyId.D2) { controller.enter(createIconvWorksheet()); return true; }
  if (keyId === KeyId.D3) { controller.enter(createProfitWorksheet()); return true; }     // REQ-018 fix
  if (keyId === KeyId.D4) { controller.enter(createDeprWorksheet() as never); return true; }
  if (keyId === KeyId.D6) { controller.enter(createBreakevenWorksheet()); return true; }  // REQ-019 fix
  if (keyId === KeyId.D8) { controller.enter(createStatWorksheet() as never); return true; }
  if (keyId === KeyId.D9) { controller.enter(createBondWorksheet() as never); return true; }
  if (keyId === KeyId.D0) {
    controller.enter(createMemWorksheet(() => memoryRef, (m) => { memoryRef = m; }));
    return true;
  }
  return false;
};

const dispatchKey = (keyId: string): void => {
  // STO / RCL pending state intercept first (TASK-205..207)
  if (keyId === KeyId.STO) {
    keypadHandler.beginSto();
    refresh();
    return;
  }
  if (keyId === KeyId.RCL) {
    keypadHandler.beginRcl();
    refresh();
    return;
  }
  const pending = keypadHandler.getPending();
  if (pending.kind === 'sto' && (keyId === KeyId.PLUS || keyId === KeyId.MINUS || keyId === KeyId.MULTIPLY || keyId === KeyId.DIVIDE)) {
    const op = keyId === KeyId.PLUS ? '+' : keyId === KeyId.MINUS ? '-' : keyId === KeyId.MULTIPLY ? '*' : '/';
    keypadHandler.stoOp(op);
    refresh();
    return;
  }
  if ((pending.kind === 'sto' || pending.kind === 'rcl' || pending.kind === 'sto-op') && keyId.startsWith('D')) {
    const n = parseInt(keyId.slice(1), 10);
    if (keypadHandler.digit(n)) {
      refresh();
      return;
    }
  }
  if (pending.kind !== 'none' && !keyId.startsWith('D')) {
    keypadHandler.cancel();
  }

  // 2ND-prefixed worksheet entry (TASK-169, 174, 178, 181, 183, 190, 195, 199, 204).
  if (tryEnterWorksheet(keyId)) {
    // Consume the 2ND latch via engine (skip if it was already consumed —
    // e.g. the BGN toggle path internally issues ARROW_UP which the
    // dispatcher consumes the latch for).
    if (engine.getState().secondLatched) engine.pressKey(KeyId.SECOND);
    refresh();
    return;
  }

  // Primary (no-2ND) CF entry — enters the CF worksheet directly. Primary
  // NPV / IRR map to scientific scalar shortcuts within CF flow; for v1 they
  // also enter the CF worksheet so they remain reachable.
  if (!engine.getState().secondLatched && tryEnterPrimaryWorksheet(keyId)) {
    refresh();
    return;
  }

  // Worksheet active -> route through controller.
  if (controller.getActiveWorksheet()) {
    const action = mapKeyToWorksheetAction(keyId, engine.getState().secondLatched);
    if (action) {
      // 2ND-modified actions need the latch cleared after consumption
      const second = engine.getState().secondLatched;
      controller.press(action);
      if (second) engine.pressKey(KeyId.SECOND);  // toggle off
      refresh();
      return;
    }
  }

  // Scientific-row chassis virtual ids — yˣ / 1/x / LN — route to engine's
  // virtual dispatcher BEFORE the KeyId-membership gate (REQ-007 fix). These
  // ids never match Object.values(KeyId), so without this branch they fall
  // through silently and the user sees no LCD update.
  if (SCIENTIFIC_VIRTUAL_KEYS.has(keyId)) {
    engine.pressVirtual(keyId);
    refresh();
    return;
  }

  // Standard engine dispatch.
  if (Object.values(KeyId).includes(keyId as KeyId)) {
    engine.pressKey(keyId as KeyId);
  }
  refresh();
};

const mapKeyToWorksheetAction = (keyId: string, second: boolean): WorksheetAction | null => {
  if (keyId.startsWith('D')) return { kind: 'digit', value: parseInt(keyId.slice(1), 10) };
  if (keyId === KeyId.DECIMAL) return { kind: 'decimal' };
  if (keyId === KeyId.SIGN) return { kind: 'sign' };
  if (keyId === KeyId.ENTER) return second ? { kind: 'set' } : { kind: 'enter' };
  if (keyId === KeyId.CPT) return second ? { kind: 'quit' } : { kind: 'cpt' };
  if (keyId === KeyId.ARROW_UP) return { kind: 'arrow', dir: 'up' };
  if (keyId === KeyId.ARROW_DOWN) return { kind: 'arrow', dir: 'down' };
  if (keyId === KeyId.CE_C) return { kind: 'clear' };
  return null;
};

const refresh = (): void => {
  renderDisplay(engine, controller);
};

// 6. Touch handler — pointer events on keypad SVG.
attachTouchHandler(svg, { onPress: dispatchKey });

// 7. Keymap modal + help affordance + keyboard handler.
const modal = renderKeymapModal();
document.body.appendChild(modal.element);
document.body.appendChild(renderHelpAffordance(() => modal.open()));

attachKeyboardHandler({
  onKey: (k) => dispatchKey(k),
  onHelp: () => modal.open(),
  isModalOpen: () => modal.isOpen(),
  onModalEscape: () => modal.close(),
});

// 8. Footer disclaimer.
document.body.appendChild(renderFooter());

// Initial render.
refresh();
