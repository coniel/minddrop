import { createKeyValueStore } from '@minddrop/stores';
import { WindowSizeSlot } from '@minddrop/utils';

export interface DialogSize {
  /**
   * The dialog width in pixels.
   */
  width: number;

  /**
   * The dialog height in pixels.
   */
  height: number;
}

/**
 * Builds a composite config key from a design ID and window
 * size slot, e.g. `"my-design:sm"`.
 */
export function dialogSizeKey(designId: string, slot: WindowSizeSlot): string {
  return `${designId}:${slot}`;
}

/**
 * Persistent store that stores entry dialog sizes keyed by
 * `designId:windowSizeSlot`.
 */
export const EntryDialogSizesStore = createKeyValueStore<
  Record<string, DialogSize>
>(
  'Databases:EntryDialogSizes',
  {},
  {
    persistTo: 'workspace-config',
    namespace: 'entry-dialog-sizes',
  },
);
