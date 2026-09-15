import { createVanillaStore, useStore } from '@minddrop/stores';

interface PendingColumnRenameState {
  /**
   * The view and column value of a just added column whose rename
   * popover should open, null while there is none.
   */
  pending: { viewId: string; value: string } | null;
}

// Carries a just added column from the options menu, which adds
// it, to the board, which opens its rename popover. The two render
// in separate trees, so the handover cannot travel via props.
const PendingColumnRenameStore = createVanillaStore<PendingColumnRenameState>(
  () => ({ pending: null }),
);

/**
 * Marks a just added column as awaiting its rename popover.
 *
 * @param viewId - The ID of the view the column was added from.
 * @param value - The new column's option value.
 */
export function setPendingColumnRename(viewId: string, value: string): void {
  PendingColumnRenameStore.setState({ pending: { viewId, value } });
}

/**
 * Clears the pending column rename once the popover has opened.
 */
export function clearPendingColumnRename(): void {
  PendingColumnRenameStore.setState({ pending: null });
}

/**
 * Retrieves the column value awaiting its rename popover in a view.
 *
 * @param viewId - The ID of the view to retrieve the pending column of.
 * @returns The pending column's option value, or null when the view has none.
 */
export function usePendingColumnRename(viewId: string): string | null {
  return useStore(PendingColumnRenameStore, (state) =>
    state.pending?.viewId === viewId ? state.pending.value : null,
  );
}
