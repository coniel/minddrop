import { Events } from '@minddrop/events';
import { swallowNextClick } from '@minddrop/utils';
import { DragSession } from './DragSession';
import { DragStore } from './DragStore';
import { DroppablesRegistry } from './DroppablesRegistry';
import { getPointerPosition } from './PointerPositionStore';
import { DragEndedEvent } from './events';
import { getActiveDrag } from './getActiveDrag';
import { resolveDropPosition } from './utils';

/**
 * Ends the drag in progress. A release over a drop target drops
 * the drag on the innermost one. A cancelled drag, or one released
 * over no target, drops on nothing. Does nothing while no drag is
 * in progress.
 *
 * @param released - Whether the pointer was released, rather than the drag cancelled.
 *
 * @dispatches drag-and-drop:ended
 */
export function endDrag(released: boolean): void {
  // Get the drag in progress and its session
  const session = DragSession.current;
  const drag = getActiveDrag();

  if (!session || !drag) {
    return;
  }

  // Resolve the innermost target under the pointer and whether the
  // drag drops on it.
  const target = session.overKeys.length
    ? DroppablesRegistry.get(session.overKeys[0])
    : null;
  const dropped = released && target !== null;

  // Close the session and stop listening for the pointer
  DragSession.current = null;
  session.removeListeners();

  // Stop the auto-scroll loop if it is running
  if (session.scrollFrame !== null) {
    cancelAnimationFrame(session.scrollFrame);
  }

  // Drop on the target, then end the drag even if the drop handler
  // throws.
  try {
    // Check if the drag drops on the target. If so, hand it the drop.
    if (dropped && target) {
      // Get the pointer position and the target's options
      const { x: clientX, y: clientY } = getPointerPosition();
      const options = target.options.current;

      // Call the target's drop handler
      options.onDrop?.({
        targetType: options.type,
        targetId: options.id,
        index: options.index,
        position: resolveDropPosition(
          target.element.getBoundingClientRect(),
          clientX,
          clientY,
          options,
        ),
        data: drag.data,
        origin: drag.origin,
        clientX,
        clientY,
      });
    }
  } finally {
    // Clear the drag from the store
    DragStore.getState().clear();

    // Unmark the document as dragging
    document.documentElement.removeAttribute('data-dragging');

    // Tell the targets the drag was over that it has left
    session.overKeys.forEach((key) => {
      DroppablesRegistry.get(key)?.notify({
        isDraggingOver: false,
        dropIndicatorPosition: null,
      });
    });

    // Swallow the click the release fires on whatever it lands on. It
    // must not act as a press.
    swallowNextClick();

    // Dispatch a drag ended event
    Events.dispatch(DragEndedEvent, { drag, dropped });
  }
}
