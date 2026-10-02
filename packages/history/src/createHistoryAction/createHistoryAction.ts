import { entityId } from '@minddrop/utils';
import { HistoryActionEntityType } from '../constants';
import { HistoryAction } from '../types';

/**
 * Creates a history action for a cause.
 *
 * @param cause - What was done, named by the package doing it.
 * @returns The created action.
 */
export function createHistoryAction(cause: string): HistoryAction {
  // Mint an ID for the action and pair it with its cause
  return { id: entityId(HistoryActionEntityType), cause };
}
