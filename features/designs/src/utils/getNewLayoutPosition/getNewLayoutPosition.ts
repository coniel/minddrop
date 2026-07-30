import { Layout } from '@minddrop/designs';

// Horizontal gap between an added layout and existing frames
const NEW_LAYOUT_GAP = 100;

/**
 * Computes the frame position for a layout added to a design:
 * to the right of the rightmost existing frame, aligned with the
 * topmost one. Returns undefined when the design has no layouts.
 */
export function getNewLayoutPosition(
  layouts: Layout[],
): { x: number; y: number } | undefined {
  if (!layouts.length) {
    return undefined;
  }

  const rightmostEdge = Math.max(
    ...layouts.map((layout) => layout.frame.x + layout.frame.width),
  );
  const topmostEdge = Math.min(...layouts.map((layout) => layout.frame.y));

  return { x: rightmostEdge + NEW_LAYOUT_GAP, y: topmostEdge };
}
