import { DropEventData } from '@minddrop/selection';
import { NewEntryPickerDataKey } from '@minddrop/ui-components';

/**
 * Checks whether a drop event contains a new entry card.
 *
 * @param data - The drop event data.
 * @returns Whether the drop contains a new entry card.
 */
export function dropContainsNewEntryPickerCard(data: DropEventData): boolean {
  // Drops from outside the app carry no MindDrop data
  if (!data.data || typeof data.data !== 'object') {
    return false;
  }

  return Boolean((data.data as Record<string, unknown>)[NewEntryPickerDataKey]);
}
