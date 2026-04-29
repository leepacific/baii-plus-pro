// PAGE-001 (`/`). TASK-053 — verify no audio APIs and no onboarding overlays in /src.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;

const FORBIDDEN_TOKENS = [
  'AudioContext',
  'new Audio(',
  '<audio',
  'playsound',
  'tutorial',
  'onboarding',
  'welcome',
];

const walk = (dir: string): string[] => {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|js)$/.test(name) && !name.endsWith('.test.ts')) out.push(full);
  }
  return out;
};

describe('no-audio-no-onboarding', () => {
  it('finds no forbidden tokens in /src/', () => {
    const offenders: string[] = [];
    for (const file of walk(ROOT)) {
      const content = readFileSync(file, 'utf-8');
      for (const token of FORBIDDEN_TOKENS) {
        if (content.toLowerCase().includes(token.toLowerCase())) {
          offenders.push(`${file}: ${token}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
