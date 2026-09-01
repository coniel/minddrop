import { getSelection } from '../getSelection';

/**
 * Returns the IDs of items in the current selection as an array.
 *
 * @returns An array of IDs.
 */
export function getSelectionIds(): string[] {
  return getSelection().map((item) => item.id);
}
