import { sameIds } from '@minddrop/utils';
import { CanvasSelection, CanvasState } from '../../types';
import { getSelectedIds } from '../getSelectedIds';

/**
 * Returns the state update selecting the given IDs, merging them
 * into the current selection when additive.
 *
 * @param state - The canvas state.
 * @param type - The type of the items being selected.
 * @param ids - The IDs to select.
 * @param additive - Whether to add to a selection of the same type.
 * @returns The state update, empty when the selection is unchanged.
 */
export function getSelectionUpdate(
  state: CanvasState,
  type: CanvasSelection['type'],
  ids: string[],
  additive?: boolean,
): Partial<CanvasState> {
  // Selection is disabled for this canvas instance
  if (!state.selectable) {
    return {};
  }

  // A selection of the other type is replaced rather than merged
  // into, so additive only carries over matching selections
  const current = additive ? getSelectedIds(state, type) : [];
  const selectedIds = current.length
    ? Array.from(new Set([...current, ...ids]))
    : ids;

  // Selecting nothing clears the selection
  if (!selectedIds.length) {
    return state.selection ? { selection: null, selectionPoint: null } : {};
  }

  // Skip updates that do not change the selection, since the
  // lasso recomputes it on every frame of a drag
  if (
    state.selection?.type === type &&
    sameIds(state.selection.ids, selectedIds)
  ) {
    return {};
  }

  // The point belonged to the selection being replaced. Callers
  // that know where this one was made set it straight after.
  return { selection: { type, ids: selectedIds }, selectionPoint: null };
}
