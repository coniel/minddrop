import { DropEventData } from '@minddrop/selection';
import { AddContentDataKey } from '@minddrop/ui-databases';

/**
 * Checks whether a drop event contains an add content card.
 *
 * @param data - The drop event data.
 * @returns Whether the drop contains an add content card.
 */
export function dropContainsAddContentCard(data: DropEventData): boolean {
  return Boolean((data.data as Record<string, unknown>)[AddContentDataKey]);
}
