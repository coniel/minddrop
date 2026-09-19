import { endDrag } from './endDrag';

/**
 * Cancels the drag in progress. A cancelled drag drops on nothing.
 * Does nothing while no drag is in progress.
 */
export function cancelDrag(): void {
  endDrag(false);
}
