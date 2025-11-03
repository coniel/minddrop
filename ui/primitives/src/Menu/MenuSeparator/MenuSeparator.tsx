import React from 'react';
import { Separator } from '../../Separator';
import { mapPropsToClasses } from '../../utils';

export type MenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  MenuSeparatorProps
>(({ children, className, ...other }, ref) => (
  <div ref={ref}>
    <Separator
      className={mapPropsToClasses({ className }, 'menu-separator')}
      orientation="horizontal"
      margin="small"
      {...other}
    />
  </div>
));

MenuSeparator.displayName = 'MenuSeparator';
