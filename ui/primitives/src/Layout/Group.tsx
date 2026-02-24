import React from 'react';
import { propsToClass } from '../utils';
import './layout.css';

export type GroupGap = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type GroupAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type GroupJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface GroupProps extends React.HTMLAttributes<HTMLElement> {
  /*
   * The rendered element.
   * @default 'div'
   */
  as?: React.ElementType;

  /*
   * Gap between children using the space token scale.
   * @default 2
   */
  gap?: GroupGap;

  /*
   * Alignment of children along the cross axis (align-items).
   * Defaults to center — the main advantage of Group over raw Flex.
   * @default 'center'
   */
  align?: GroupAlign;

  /*
   * Distribution of children along the main axis (justify-content).
   * @default 'start'
   */
  justify?: GroupJustify;

  /*
   * When true, children wrap onto multiple lines.
   * @default false
   */
  wrap?: boolean;

  /*
   * When true, children grow equally to fill available space.
   * @default false
   */
  grow?: boolean;

  /*
   * Renders as inline-flex instead of flex.
   * @default false
   */
  inline?: boolean;
}

export const Group = React.forwardRef<HTMLElement, GroupProps>(
  (
    {
      as,
      gap = 2,
      align = 'center',
      justify = 'start',
      wrap,
      grow,
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
        className={propsToClass('group', {
          gap,
          align,
          justify,
          wrap,
          grow,
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

Group.displayName = 'Group';
