import { expect, it } from 'vitest';
import { DISCLAIMER } from './legal';
it('exports the legal disclaimer verbatim', () => expect(DISCLAIMER).toMatchInlineSnapshot('"Not affiliated with Texas Instruments Incorporated. BA II Plus and Texas Instruments are trademarks of Texas Instruments Incorporated. This is an independent web replica for educational purposes."'));
