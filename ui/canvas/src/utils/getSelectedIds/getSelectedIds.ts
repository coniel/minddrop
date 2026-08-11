import { CanvasSelection, CanvasState } from '../../types';

/**
 * Returns the IDs in the selection when it is of the given type,
 * and an empty list otherwise.
 *
 * @param state - The canvas state.
 * @param type - The selection type to read.
 * @returns The selected IDs.
 */
export function getSelectedIds(
  state: CanvasState,
  type: CanvasSelection['type'],
): string[] {
  return state.selection?.type === type ? state.selection.ids : [];
}
