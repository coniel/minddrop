import { CanvasNodeFrame, CanvasNodeSide, CanvasPoint } from '../../types';

/**
 * Returns the midpoint of a node frame's side in canvas
 * coordinates.
 *
 * @param frame - The node frame.
 * @param side - The side to get the midpoint of.
 * @returns The side's midpoint.
 */
export function getSideMidpoint(
  frame: CanvasNodeFrame,
  side: CanvasNodeSide,
): CanvasPoint {
  switch (side) {
    case 'top':
      return { x: frame.x + frame.width / 2, y: frame.y };
    case 'right':
      return { x: frame.x + frame.width, y: frame.y + frame.height / 2 };
    case 'bottom':
      return { x: frame.x + frame.width / 2, y: frame.y + frame.height };
    case 'left':
      return { x: frame.x, y: frame.y + frame.height / 2 };
  }
}
