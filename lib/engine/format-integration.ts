import { type EngineState } from '../../src/core/state';
export const preserveFormat = (before: EngineState, after: EngineState): EngineState => ({ ...after, format: before.format });
