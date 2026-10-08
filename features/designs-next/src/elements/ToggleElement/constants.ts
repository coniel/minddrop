import { DesignElementSize } from '@minddrop/designs-next';
import { DefaultContentIconSetId, Icons } from '@minddrop/ui-icons';
import { ToggleElementSize, ToggleStyle } from './ToggleElement.types';

/**
 * The styles a toggle element draws its state in, in display order.
 */
export const ToggleStyles: ToggleStyle[] = ['checkbox', 'switch', 'icon'];

/**
 * The style a toggle element draws its state in when none is picked.
 */
export const DefaultToggleStyle: ToggleStyle = 'checkbox';

/**
 * The sizes a toggle element draws its state at, in display order.
 */
export const ToggleElementSizes: ToggleElementSize[] = ['sm', 'md', 'lg'];

/**
 * The size a toggle element draws its state at when none is picked.
 */
export const DefaultToggleElementSize: ToggleElementSize = 'md';

// The checkbox's block at each size, in grid units of four pixels,
// rounded up from its 12, 16 and 20 pixel squares. The icon style
// draws at the same sizes.
const CheckboxBlockSizes: Record<ToggleElementSize, DesignElementSize> = {
  sm: { columnSpan: 3, rowSpan: 3 },
  md: { columnSpan: 4, rowSpan: 4 },
  lg: { columnSpan: 5, rowSpan: 5 },
};

/**
 * The block size of each style at each size, in grid units of four
 * pixels, rounded up from the control's pixel size: the checkbox's
 * and the icon's 12, 16 and 20 pixel squares, and the switch's 24
 * by 14, 32 by 18 and 40 by 22 pixel tracks.
 */
export const ToggleBlockSizes: Record<
  ToggleStyle,
  Record<ToggleElementSize, DesignElementSize>
> = {
  checkbox: CheckboxBlockSizes,
  switch: {
    sm: { columnSpan: 6, rowSpan: 4 },
    md: { columnSpan: 8, rowSpan: 5 },
    lg: { columnSpan: 10, rowSpan: 6 },
  },
  icon: CheckboxBlockSizes,
};

/**
 * The icon the icon style draws for a true value when none is picked.
 */
export const DefaultCheckedIcon = Icons.stringify({
  set: DefaultContentIconSetId,
  icon: 'square-check-big',
  color: 'default',
});

/**
 * The icon the icon style draws for any other value when none is
 * picked.
 */
export const DefaultUncheckedIcon = Icons.stringify({
  set: DefaultContentIconSetId,
  icon: 'square',
  color: 'default',
});
