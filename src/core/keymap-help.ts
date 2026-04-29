import { KEY_METADATA, type KeyId } from '../keypad/key-id';
import { SECONDARY_FUNCTION_MAP } from '../keypad/secondary-function-map';
export interface KeymapHelpEntry { key: KeyId; label: string; binding: string; secondaryBinding: string }
export const KEYMAP_HELP: KeymapHelpEntry[] = KEY_METADATA.map((m) => ({
  key: m.key,
  label: m.label,
  binding: m.binding,
  secondaryBinding: SECONDARY_FUNCTION_MAP[m.key] ?? ''
}));
