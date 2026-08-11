import { CanvasNodeSide } from '../../types';

/**
 * Returns the side opposite to the given side.
 *
 * @param side - The side to flip.
 * @returns The opposite side.
 */
export function getOppositeSide(side: CanvasNodeSide): CanvasNodeSide {
  if (side === 'top') {
    return 'bottom';
  }

  if (side === 'bottom') {
    return 'top';
  }

  if (side === 'left') {
    return 'right';
  }

  return 'left';
}
