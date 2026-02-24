import React from 'react';
import { Separator } from '../Separator';
import { propsToClass } from '../utils';

export type MenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  MenuSeparatorProps
>(({ className, ...other }, ref) => (
  <div ref={ref}>
    <Separator
      className={propsToClass('menu-separator', { className })}
      orientation="horizontal"
      margin="small"
      {...other}
    />
  </div>
));

MenuSeparator.displayName = 'MenuSeparator';
