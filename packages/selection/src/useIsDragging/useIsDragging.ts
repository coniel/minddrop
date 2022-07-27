import { useSelectionStore } from '../useSelectionStore';

/**
 * Returns a boolean indicating whether a
 * drag action is in progress.
 *
 * @returns A boolean indicating the dragging state.
 */
export function useIsDragging(): boolean {
  // Return the dragging state
  return useSelectionStore().isDragging;
}
