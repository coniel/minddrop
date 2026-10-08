import { ElementCornerRadius } from '@minddrop/designs-next';
import { ChipSize } from '@minddrop/ui-primitives';

/**
 * The corner radius a chips element draws its chips with when none
 * is set.
 */
export const DefaultChipCornerRadius: ElementCornerRadius = 'sm';

/**
 * The size a chips element draws its chips at when none is set.
 */
export const DefaultChipSize: ChipSize = 'md';

/**
 * The chip sizes in display order.
 */
export const ChipSizes: ChipSize[] = ['sm', 'md', 'lg'];

/**
 * The row span one line of chips needs at each size. A chip's
 * height in grid units.
 */
export const ChipSizeRowSpans: Record<ChipSize, number> = {
  sm: 5,
  md: 6,
  lg: 7,
};
