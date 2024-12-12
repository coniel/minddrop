import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './Menu.css';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the Menu.
   */
  children?: React.ReactNode;
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ children, className, ...other }, ref) => (
    <div
      ref={ref}
      role="menu"
      className={mapPropsToClasses({ className }, 'menu')}
      {...other}
    >
      {children}
    </div>
  ),
);

Menu.displayName = 'Menu';
