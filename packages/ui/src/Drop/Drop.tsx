import React, { FC } from 'react';
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
}

export const Drop: FC<DropProps> = ({
  children,
  className,
  color,
  ...other
}) => {
  return (
    <div className={mapPropsToClasses({ className, color }, 'drop')} {...other}>
      {children}
    </div>
  );
};
