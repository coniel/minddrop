import { DropPosition, DroppableOptions } from '../../types';

export type ResolveDropPositionOptions = Pick<
  DroppableOptions,
  'axis' | 'enableInside' | 'edgeThreshold'
>;

/**
 * Resolves where a pointer position sits relative to a drop
 * target's bounds: before, after or inside it.
 *
 * @param rect - The drop target's bounds.
 * @param clientX - The horizontal position of the pointer in the viewport.
 * @param clientY - The vertical position of the pointer in the viewport.
 * @param options - The target's axis and edge settings.
 * @returns The drop position.
 */
export function resolveDropPosition(
  rect: DOMRect,
  clientX: number,
  clientY: number,
  options: ResolveDropPositionOptions = {},
): DropPosition {
  // Resolve the options against their defaults
  const {
    axis = 'container',
    enableInside = false,
    edgeThreshold = 0.25,
  } = options;

  // A container takes drops inside itself only
  if (axis === 'container') {
    return 'inside';
  }

  // Resolve the pointer's position along the axis as a share of the
  // target's extent.
  const relativePosition =
    axis === 'horizontal'
      ? (clientX - rect.left) / rect.width
      : (clientY - rect.top) / rect.height;

  // Check if the middle counts as inside. If not, the midpoint
  // divides before from after.
  if (!enableInside) {
    return relativePosition < 0.5 ? 'before' : 'after';
  }

  // Resolve a position within the leading edge zone to before the target
  if (relativePosition < edgeThreshold) {
    return 'before';
  }

  // Resolve a position within the trailing edge zone to after it
  if (relativePosition > 1 - edgeThreshold) {
    return 'after';
  }

  // Resolve any other position to inside
  return 'inside';
}
