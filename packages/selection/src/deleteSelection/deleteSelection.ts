import { Events } from '@minddrop/events';
import { getSelection } from '../getSelection';
import { deleteSelectionItems } from '../utils';

/**
 * Delets the current selection.
 *
 * @dispatches selection:delete
 */
export function deleteSelection(): void {
  // Get the current selection
  const selection = getSelection();

  // Delete the selection
  deleteSelectionItems();

  Events.dispatch('selection:delete', selection);
}
