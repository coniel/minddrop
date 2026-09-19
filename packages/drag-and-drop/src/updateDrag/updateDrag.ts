import { resolveAutoScroll, resolveScrollContainers } from '@minddrop/utils';
import { DragSession, DragSessionState } from '../DragSession';
import { DroppablesRegistry } from '../DroppablesRegistry';
import {
  getPointerPosition,
  updatePointerPosition,
} from '../PointerPositionStore';
import { SCROLL_EDGE_SIZE, SCROLL_MAX_SPEED } from '../constants';
import { getActiveDrag } from '../getActiveDrag';
import { resolveDropIndicatorPosition, resolveDropTargets } from '../utils';

/**
 * Moves the drag in progress to a point in the viewport. Drop targets
 * are told as the drag enters and leaves them. Scrollable elements
 * scroll while the drag sits near their edges. Does nothing while no
 * drag is in progress.
 *
 * @param clientX - The horizontal position of the pointer in the viewport.
 * @param clientY - The vertical position of the pointer in the viewport.
 */
export function updateDrag(clientX: number, clientY: number): void {
  // Get the drag in progress and its session
  const session = DragSession.current;
  const drag = getActiveDrag();

  if (!session || !drag) {
    return;
  }

  // Record the pointer position
  updatePointerPosition(clientX, clientY);

  // Resolve the drop targets under the pointer
  const hitElement = document.elementFromPoint(clientX, clientY);
  const targets = hitElement
    ? resolveDropTargets(hitElement, drag, clientX, clientY)
    : [];
  const overKeys = targets.map((target) => target.entry.key);

  // Tell the targets the drag has left that it is no longer over them
  session.overKeys.forEach((key) => {
    if (!overKeys.includes(key)) {
      DroppablesRegistry.get(key)?.notify({
        isDraggingOver: false,
        dropIndicatorPosition: null,
      });
    }
  });

  // Record the targets the drag is over
  session.overKeys = overKeys;

  // Tell the targets the drag is over where the drop would land
  targets.forEach(({ entry, position }) => {
    // Get the target's options
    const options = entry.options.current;

    // Tell the target where its indicator goes
    entry.notify({
      isDraggingOver: true,
      dropIndicatorPosition: resolveDropIndicatorPosition(
        position,
        options.index,
        options.isLastChild,
      ),
    });

    // Report the move to the target
    if (hitElement) {
      options.onDragMove?.({ clientX, clientY, target: hitElement, position });
    }
  });

  // Scroll the elements whose edges the pointer sits near
  scheduleAutoScroll(session, hitElement, clientX, clientY);
}

/**
 * Resolves what the drag scrolls from the pointer's position and
 * starts the frame loop applying it, unless already running.
 *
 * @param session - The drag's session.
 * @param hitElement - The element under the pointer, or null when there is none.
 * @param clientX - The horizontal position of the pointer in the viewport.
 * @param clientY - The vertical position of the pointer in the viewport.
 */
function scheduleAutoScroll(
  session: DragSessionState,
  hitElement: Element | null,
  clientX: number,
  clientY: number,
): void {
  // Resolve the scroll containers around the element under the
  // pointer, none when the pointer is over no element.
  const hitScrollables = hitElement
    ? resolveHitScrollables(session, hitElement)
    : [];

  // Move the containers under the pointer to the front of those the
  // drag has been over, so that the innermost are tried first and
  // the ones the pointer has left keep scrolling while it overshoots
  // their edges.
  session.visitedScrollables = hitScrollables.concat(
    session.visitedScrollables.filter(
      (element) => !hitScrollables.includes(element),
    ),
  );

  // Resolve the scroll along each axis
  session.autoScroll = resolveAutoScroll(
    session.visitedScrollables,
    clientX,
    clientY,
    { edgeSize: SCROLL_EDGE_SIZE, maxSpeed: SCROLL_MAX_SPEED },
  );

  // Read the scroll along each axis
  const { x, y } = session.autoScroll;

  // Start the frame loop if something scrolls and it is not already running
  if ((x || y) && session.scrollFrame === null) {
    session.scrollFrame = requestAnimationFrame(stepAutoScroll);
  }
}

/**
 * Resolves the scroll containers around the element under the
 * pointer, cached for the drag since resolving reads every
 * ancestor's computed style.
 *
 * @param session - The drag's session.
 * @param hitElement - The element under the pointer.
 * @returns The scroll containers, innermost first.
 */
function resolveHitScrollables(
  session: DragSessionState,
  hitElement: Element,
): HTMLElement[] {
  // Look up the containers cached for the element
  let scrollables = session.scrollables.get(hitElement);

  // Check if the containers are cached. If not, resolve and cache
  // them.
  if (!scrollables) {
    scrollables = resolveScrollContainers(hitElement);
    session.scrollables.set(hitElement, scrollables);
  }

  return scrollables;
}

/**
 * Applies the scroll resolved for the last move, then re-runs the
 * move at the pointer's position. The re-run hits the targets
 * sliding under the pointer and resolves the next scroll step.
 */
function stepAutoScroll(): void {
  // Get the session
  const session = DragSession.current;

  if (!session) {
    return;
  }

  // Clear the frame so the re-run can schedule the next one
  session.scrollFrame = null;

  // Read the scroll along each axis
  const { x, y } = session.autoScroll;

  // Apply the horizontal scroll
  if (x) {
    x.element.scrollLeft += x.velocity;
  }

  // Apply the vertical scroll
  if (y) {
    y.element.scrollTop += y.velocity;
  }

  // Get the pointer position
  const position = getPointerPosition();

  // Re-run the move at the pointer's position
  updateDrag(position.x, position.y);
}
