// PAGE-001 (`/`). Numeric entry buffer shared by worksheet UIs.
// Builds digit / decimal / sign sequences into a numeric string.
export interface EntryBuffer {
  text: string;
  push(action: { kind: 'digit'; value: number } | { kind: 'decimal' } | { kind: 'sign' }): void;
  reset(seed?: string): void;
  read(): number | null;
}

export const createEntryBuffer = (): EntryBuffer => {
  const state = { text: '' };
  return {
    get text() { return state.text === '' ? '0' : state.text; },
    push(action) {
      if (action.kind === 'digit') {
        if (state.text === '0') state.text = String(action.value);
        else state.text += String(action.value);
      } else if (action.kind === 'decimal') {
        if (!state.text.includes('.')) {
          state.text = state.text === '' ? '0.' : state.text + '.';
        }
      } else if (action.kind === 'sign') {
        if (state.text.startsWith('-')) state.text = state.text.slice(1);
        else if (state.text !== '' && state.text !== '0') state.text = '-' + state.text;
      }
    },
    reset(seed) { state.text = seed ?? ''; },
    read() {
      if (state.text === '' || state.text === '-' || state.text === '.') return null;
      const n = Number(state.text);
      return Number.isFinite(n) ? n : null;
    },
  };
};
