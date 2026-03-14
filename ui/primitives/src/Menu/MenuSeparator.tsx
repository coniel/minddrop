import React from 'react';
import { Separator, SeparatorProps } from '../Separator';
import { propsToClass } from '../utils';

export type MenuSeparatorProps = SeparatorProps;

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
