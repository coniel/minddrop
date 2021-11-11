import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Text, TextProps } from '../../Text';
import './MenuLabel.css';

export interface MenuLabelProps extends TextProps {
  /**
   * The label content.
   */
  children?: React.ReactNode;
}

export const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ children, className, ...other }, ref) => {
    return (
      <div ref={ref}>
        <Text
          component="div"
          color="light"
          weight="semibold"
          size="tiny"
          className={mapPropsToClasses({ className }, 'menu-label')}
          {...other}
        >
          {children}
        </Text>
      </div>
    );
  },
);
