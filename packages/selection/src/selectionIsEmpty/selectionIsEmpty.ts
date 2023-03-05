import { getSelection } from '../getSelection';

/**
 * Returns a boolean indicating whether or not the selection is empty.
 *
 * @returns A boolean indicating whether the selection is empty.
 */
export function selectionIsEmpty(): boolean {
  // Get the current selection
  const selection = getSelection();

  // Return whether the selection is empty
  return selection.length === 0;
}
