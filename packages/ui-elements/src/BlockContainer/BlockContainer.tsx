import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { ContentColor } from '../types';
import './BlockContainer.css';

export interface BlockContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The block content.
   */
  children?: React.ReactNode;

  /**
   * The block color.
   */
  color?: ContentColor;

  /**
   * The block selected state.
   */
  selected?: boolean;
}

export const BlockContainer = React.forwardRef<
  HTMLDivElement,
  BlockContainerProps
>(({ children, className, color, selected, ...other }, ref) => (
  <div
    className={mapPropsToClasses({ className, color, selected }, 'block')}
    ref={ref}
    {...other}
  >
    {children}
  </div>
));

BlockContainer.displayName = 'BlockContainer';
