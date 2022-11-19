import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './DropTitle.css';

export interface DropTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content title.
   */
  children?: React.ReactNode;
}

export const DropTitle: FC<DropTitleProps> = ({
  children,
  className,
  ...other
}) => (
  <div className={mapPropsToClasses({ className }, 'drop-title')} {...other}>
    {children}
  </div>
);
