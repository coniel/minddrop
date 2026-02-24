import React from 'react';
import { propsToClass } from '../utils';

export type FlexItemGrow = 1 | 2 | 3;
export type FlexItemShrink = 0 | 1 | 2 | 3;
export type FlexItemAlignSelf = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexItemMarginAuto = 'left' | 'right' | 'top' | 'bottom' | 'x' | 'y';

export interface FlexItemProps extends React.HTMLAttributes<HTMLElement> {
  /*
   * The rendered element.
   * @default 'div'
   */
  as?: React.ElementType;

  /*
   * Sets flex-grow. Use 1 to fill remaining space, higher values
   * to grow proportionally relative to sibling FlexItems.
   */
  grow?: FlexItemGrow;

  /*
   * Sets flex-shrink. Use 0 to prevent the item from shrinking
   * below its natural size.
   */
  shrink?: FlexItemShrink;

  /*
   * Overrides the parent's align-items for this item.
   */
  alignSelf?: FlexItemAlignSelf;

  /*
   * Applies auto margin to push the item or its siblings away.
   * - `left`   — pushes item to the far right of its row
   * - `right`  — pushes item to the far left of its row
   * - `x`      — centers item horizontally
   * - `top`    — pushes item to the bottom of its column
   * - `bottom` — pushes item to the top of its column
   * - `y`      — centers item vertically
   */
  marginAuto?: FlexItemMarginAuto;
}

export const FlexItem = React.forwardRef<HTMLElement, FlexItemProps>(
  (
    {
      as,
      grow,
      shrink,
      alignSelf,
      marginAuto,
      className,
      children,
      ...other
    },
    ref,
  ) => {
    const Component = as ?? 'div';

    return (
      <Component
        ref={ref}
        className={propsToClass('flex-item', {
          grow,
          shrink,
          alignSelf,
          marginAuto,
          className,
        })}
        {...other}
      >
        {children}
      </Component>
    );
  },
);

FlexItem.displayName = 'FlexItem';
