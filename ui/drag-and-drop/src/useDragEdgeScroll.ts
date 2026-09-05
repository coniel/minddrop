import { RefObject, useEffect } from 'react';

// Width of the zones along the element's edges which trigger
// scrolling.
const EDGE_SIZE = 180;

// Scroll speed in pixels per frame at the deepest point of an
// edge zone.
const MAX_SPEED = 16;

/**
 * Scrolls an element while a drag hovers near its edges, ramping
 * the speed up with proximity to the edge.
 *
 * @param scrollElementRef - Ref to the scrollable element.
 */
export function useDragEdgeScroll(
  scrollElementRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const element = scrollElementRef.current;

    // Check that the scrollable element has mounted
    if (!element) {
      return;
    }

    // The scroll applied on each animation frame
    let velocityX = 0;
    let velocityY = 0;

    // The scheduled animation frame, null while idle
    let frame: number | null = null;

    // Apply the velocity each frame until it drops to zero
    const step = () => {
      element.scrollLeft += velocityX;
      element.scrollTop += velocityY;

      frame =
        velocityX !== 0 || velocityY !== 0 ? requestAnimationFrame(step) : null;
    };

    // Halt the scroll and drop the scheduled frame
    const stop = () => {
      velocityX = 0;
      velocityY = 0;

      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    // Update the velocity from the drag position, starting the
    // frame loop when the drag sits in an edge zone.
    const handleDragOver = (event: DragEvent) => {
      const rect = element.getBoundingClientRect();

      velocityX = resolveEdgeVelocity(event.clientX, rect.left, rect.right);
      velocityY = resolveEdgeVelocity(event.clientY, rect.top, rect.bottom);

      if ((velocityX !== 0 || velocityY !== 0) && frame === null) {
        frame = requestAnimationFrame(step);
      }
    };

    // Halt when the drag leaves the element itself, ignoring
    // leave events fired on transitions between its children.
    const handleDragLeave = (event: DragEvent) => {
      if (
        event.relatedTarget instanceof Node &&
        element.contains(event.relatedTarget)
      ) {
        return;
      }

      stop();
    };

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', stop);
    window.addEventListener('dragend', stop);

    return () => {
      stop();
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', stop);
      window.removeEventListener('dragend', stop);
    };
  }, [scrollElementRef]);
}

/**
 * Resolves the scroll velocity along one axis from the drag
 * position's depth into the edge zones.
 *
 * @param position - The drag position along the axis.
 * @param start - The element's leading edge along the axis.
 * @param end - The element's trailing edge along the axis.
 * @returns The velocity, zero outside the edge zones.
 */
function resolveEdgeVelocity(
  position: number,
  start: number,
  end: number,
): number {
  // Depth into the leading edge zone scrolls backwards
  if (position < start + EDGE_SIZE) {
    return -MAX_SPEED * clampDepth(1 - (position - start) / EDGE_SIZE);
  }

  // Depth into the trailing edge zone scrolls forwards
  if (position > end - EDGE_SIZE) {
    return MAX_SPEED * clampDepth(1 - (end - position) / EDGE_SIZE);
  }

  return 0;
}

/**
 * Clamps an edge zone depth to the 0-1 range, so that positions
 * past the element's bounds scroll at full speed.
 *
 * @param depth - The raw depth into the zone.
 * @returns The clamped depth.
 */
function clampDepth(depth: number): number {
  return Math.min(1, Math.max(0, depth));
}
