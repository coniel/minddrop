import { DraggableUtils } from '@minddrop/drag-and-drop';
import { SelectionItem } from './types';
import { useDraggable } from './useDraggable';
import { SelectionUtils, useSelectable } from './useSelectable';

/**
 * Returns utility functions for adding selection and drag/drop
 * functionality to resource UI components.
 *
 * @param item - The selection item representing the resource.
 * @returns Selection and drag/drop utility functions.
 */
export function useSelectionItem(
  item: SelectionItem,
): SelectionUtils & DraggableUtils {
  const selectableApi = useSelectable(item);
  const draggableApi = useDraggable(item);

  return {
    ...selectableApi,
    ...draggableApi,
  };
}
