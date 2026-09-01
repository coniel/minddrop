import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

/**
 * An element, element ref, or virtual element which a floating
 * element (popover, menu, tooltip) positions itself against.
 */
export type Anchor = NonNullable<PopoverPrimitive.Positioner.Props['anchor']>;
