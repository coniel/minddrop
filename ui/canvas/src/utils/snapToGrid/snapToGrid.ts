import { GRID_SIZE } from '../../constants';

/**
 * Snaps a canvas coordinate to the nearest grid line.
 *
 * @param value - The coordinate in canvas units.
 * @param gridSize - The grid spacing, defaults to the canvas grid size.
 * @returns The snapped coordinate.
 */
export function snapToGrid(value: number, gridSize = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize;
}
