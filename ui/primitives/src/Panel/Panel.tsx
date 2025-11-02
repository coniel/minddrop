import React from 'react';
import { mapPropsToClasses } from '../utils';
import './Panel.css';

export interface PanelProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The content of the Panel.
   */
  children?: React.ReactNode;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ children, className, ...other }, ref) => {
    return (
      <div
        ref={ref}
        className={mapPropsToClasses({ className }, 'panel')}
        {...other}
      >
        {children}
      </div>
    );
  },
);
