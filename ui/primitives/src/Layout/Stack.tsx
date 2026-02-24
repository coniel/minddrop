import React from 'react';
import { propsToClass } from '../utils';
import './layout.css';

export type StackGap = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /*
   * The rendered element.
   * @default 'div'
   */
  as?: React.ElementType;

  /*
   * Gap between children using the space token scale.
   * @default 3
   */
  gap?: StackGap;

  /*
   * Alignment of children along the cross axis (align-items).
   * Defaults to stretch so children fill the available width.
   * @default 'stretch'
   */
  align?: StackAlign;

  /*
   * Distribution of children along the main axis (justify-content).
   * @default 'start'
   */
  justify?: StackJustify;

  /*
   * Renders as inline-flex instead of flex.
   * @default false
   */
  inline?: boolean;
}

export const Stack = React.forwardRef<HTMLElement, StackProps>(
  (
    {
      as,
      gap = 3,
      align = 'stretch',
      justify = 'start',
      inline,
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
        className={propsToClass('stack', {
          gap,
          align,
          justify,
          inline,
          className,
        })}
        {...other}
      >
        {children}
      </Component>
    );
  },
);

Stack.displayName = 'Stack';
