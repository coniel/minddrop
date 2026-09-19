/**
 * The position of a drop, relative to the element receiving it.
 * 'before' and 'after' are only valid for items of a list. The value
 * is 'inside' when the target is not an item of a list.
 */
export type DropPosition = 'before' | 'after' | 'inside';

/**
 * Where a drop target shows its indicator. A drop before the first
 * item of a list is 'start' and a drop after its last is 'end';
 * otherwise the drop position itself. Null while nothing is dragged
 * over the target.
 */
export type DropIndicatorPosition =
  | 'before'
  | 'after'
  | 'inside'
  | 'start'
  | 'end'
  | null;
