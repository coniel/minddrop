import React from 'react';
import { propsToClass } from '../utils';
import './layout.css';

export type FlexGap = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexDirection = 'row' | 'column';
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  /*
   * The rendered element.
   * @default 'div'
   */
  as?: React.ElementType;

  /*
   * Flex direction.
   * @default 'row'
   */
  direction?: FlexDirection;

  /*
   * Alignment of children along the cross axis (align-items).
   * @default 'stretch'
   */
  align?: FlexAlign;

  /*
   * Distribution of children along the main axis (justify-content).
   * @default 'start'
   */
  justify?: FlexJustify;

  /*
   * Wrapping behaviour.
   * @default 'nowrap'
   */
  wrap?: FlexWrap;

  /*
   * Gap between children using the space token scale.
   * @default 2
   */
  gap?: FlexGap;

  /*
   * Renders as inline-flex instead of flex.
   * @default false
   */
  inline?: boolean;
}

export const Flex = React.forwardRef<HTMLElement, FlexProps>(
  (
    {
      as,
      direction = 'row',
      align = 'stretch',
      justify = 'start',
      wrap = 'nowrap',
      gap = 2,
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
        className={propsToClass('flex', {
          direction,
          align,
          justify,
          wrap,
          gap,
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

Flex.displayName = 'Flex';
