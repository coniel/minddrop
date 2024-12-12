import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Separator } from '../../Separator';

export type MenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  MenuSeparatorProps
>(({ children, className, ...other }, ref) => (
  <div ref={ref}>
    <Separator
      className={mapPropsToClasses({ className }, 'menu-label')}
      orientation="horizontal"
      margin="small"
      {...other}
    />
  </div>
));

MenuSeparator.displayName = 'MenuSeparator';
