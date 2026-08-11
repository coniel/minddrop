import { CanvasSelection, CanvasState } from '../../types';
import { getSelectedIds } from '../getSelectedIds';

/**
 * Returns the state update adding an ID to the selection, or
 * removing it when it is already selected.
 *
 * @param state - The canvas state.
 * @param type - The type of the item being toggled.
 * @param id - The ID to toggle.
 * @returns The state update, empty when the selection is unchanged.
 */
export function getToggleSelectionUpdate(
  state: CanvasState,
  type: CanvasSelection['type'],
  id: string,
): Partial<CanvasState> {
  // Selection is disabled for this canvas instance
  if (!state.selectable) {
    return {};
  }

  const current = getSelectedIds(state, type);

  // Remove the ID when it is already selected, add it otherwise
  const selectedIds = current.includes(id)
    ? current.filter((selectedId) => selectedId !== id)
    : [...current, id];

  // Deselecting the last item clears the selection
  if (!selectedIds.length) {
    return { selection: null, selectionPoint: null };
  }

  return { selection: { type, ids: selectedIds }, selectionPoint: null };
}
