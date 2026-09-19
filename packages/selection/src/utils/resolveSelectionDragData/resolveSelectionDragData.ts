import { parseTransferData } from '@minddrop/utils';
import { serializeSelection } from '../serializeSelection';

/**
 * Resolves the current selection into drag data.
 *
 * @returns The drag data, keyed by data type.
 */
export function resolveSelectionDragData(): Record<string, unknown> {
  return parseTransferData(serializeSelection());
}
