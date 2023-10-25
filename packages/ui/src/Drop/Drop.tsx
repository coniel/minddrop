import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './Drop.css';
import { ContentColor } from '../types';

export interface DropProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the drop.
   */
  children?: React.ReactNode;

  /**
   * The color of the drop.
   */
  color?: ContentColor;

  /**
   * The selected state of the drop.
   */
  selected?: boolean;
}

export const Drop = React.forwardRef<HTMLDivElement, DropProps>(
  ({ children, className, color, selected, ...other }, ref) => (
    <div
      className={mapPropsToClasses({ className, color, selected }, 'drop')}
      ref={ref}
      {...other}
    >
      {children}
    </div>
  ),
);

Drop.displayName = 'Drop';
