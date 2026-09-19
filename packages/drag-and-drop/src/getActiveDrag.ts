import { DragStore } from './DragStore';
import { ActiveDrag } from './types';

/**
 * Returns the drag in progress, or null while nothing is being
 * dragged.
 */
export function getActiveDrag(): ActiveDrag | null {
  return DragStore.getState().active;
}
