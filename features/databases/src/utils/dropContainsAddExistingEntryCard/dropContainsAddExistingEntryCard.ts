import { DropEventData } from '@minddrop/selection';
import { AddExistingEntryDataKey } from '@minddrop/ui-components';

/**
 * Checks whether a drop event contains an add existing entry card.
 *
 * @param data - The drop event data.
 * @returns Whether the drop contains an add existing entry card.
 */
export function dropContainsAddExistingEntryCard(data: DropEventData): boolean {
  // Drops from outside the app carry no MindDrop data
  if (!data.data || typeof data.data !== 'object') {
    return false;
  }

  return Boolean(
    (data.data as Record<string, unknown>)[AddExistingEntryDataKey],
  );
}
