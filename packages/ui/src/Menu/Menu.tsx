import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './Menu.css';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the Menu.
   */
  children?: React.ReactNode;
}

export const Menu: FC<MenuProps> = ({ children, className, ...other }) => {
  return (
    <div
      role="menu"
      className={mapPropsToClasses({ className }, 'menu')}
      {...other}
    >
      {children}
    </div>
  );
};
