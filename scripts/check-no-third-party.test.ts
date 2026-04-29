import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { checkNoThirdParty, writeForbiddenFixture } from './check-no-third-party';
describe('no third-party guard', () => {
  it('passes clean dist and reports file:line:match for forbidden origins', () => {
    const dir = mkdtempSync(join(tmpdir(), 'third-party-'));
    expect(checkNoThirdParty(dir)).toEqual([]);
    writeForbiddenFixture(dir, '<script src="https://example.com/x.js"></script>');
    expect(checkNoThirdParty(dir)[0]).toContain('fixture.html:1:');
    rmSync(dir, { recursive: true, force: true });
  });
});
