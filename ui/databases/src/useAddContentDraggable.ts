import { DragAndDrop, DraggableUtils } from '@minddrop/drag-and-drop';
import { AddContentDataKey } from './constants';

// The drag's data, marking it as an add content card
const ADD_CONTENT_DRAG_DATA = { [AddContentDataKey]: true };

/**
 * Returns drag utilities for an element which spawns the add
 * content picker when dropped. Does not modify the selection, as
 * the dragged element does not represent an existing entry.
 *
 * @returns Drag utilities.
 */
export function useAddContentDraggable(): DraggableUtils {
  // Drag the add content card, as a copy since the card stays in place
  const { draggableProps, isDragging } = DragAndDrop.useDraggable({
    id: 'add-content',
    type: AddContentDataKey,
    data: ADD_CONTENT_DRAG_DATA,
    effect: 'copy',
  });

  return { isDragging, draggableProps };
}
