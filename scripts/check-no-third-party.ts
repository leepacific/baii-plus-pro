import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const forbidden = [/(https?:\/\/[^\s"')<>]+)/g, /(^|[^:])\/\/(cdn\.|fonts\.|www\.)[^\s"')<>]+/g, /(?:import|require|fetch)\s*\(\s*['"]https?:\/\//g, /<(?:script|link)[^>]+(?:src|href)=['"]https?:\/\//g];
const scanFile = (file: string): string[] => {
  const text = readFileSync(file, 'utf8');
  const out: string[] = [];
  text.split(/\n/).forEach((line, i) => { for (const re of forbidden) { re.lastIndex = 0; const m = re.exec(line); if (m) out.push(`${file}:${i + 1}:${m[0]}`); } });
  return out;
};
const files = (dir: string): string[] => existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).flatMap((d) => { const p = join(dir, d.name); return d.isDirectory() ? files(p) : [p]; }) : [];
export const checkNoThirdParty = (dist = 'dist'): string[] => files(dist).flatMap(scanFile);
export const writeForbiddenFixture = (dist: string, pattern: string): string => { mkdirSync(dist, { recursive: true }); const p = join(dist, 'fixture.html'); writeFileSync(p, pattern); return p; };
if (process.argv[1]?.endsWith('check-no-third-party.ts')) {
  const hits = checkNoThirdParty();
  if (hits.length) { console.error(hits.join('\n')); process.exit(1); }
}
