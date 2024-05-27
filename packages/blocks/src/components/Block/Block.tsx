import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { ContentColor } from '@minddrop/ui';
import './Block.css';

export interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
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

export const Block = React.forwardRef<HTMLDivElement, BlockProps>(
  ({ children, className, color, selected, ...other }, ref) => (
    <div
      className={mapPropsToClasses({ className, color, selected }, 'block')}
      ref={ref}
      {...other}
    >
      {children}
    </div>
  ),
);

Block.displayName = 'Block';
