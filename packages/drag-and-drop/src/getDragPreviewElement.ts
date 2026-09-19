import { DragSession } from './DragSession';

/**
 * Returns the element standing in for the drag in progress, or null
 * while nothing is being dragged.
 */
export function getDragPreviewElement(): Element | null {
  return DragSession.current?.previewElement ?? null;
}
