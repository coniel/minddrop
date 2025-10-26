import React from 'react';
import { Text, TextProps } from '../../Text';
import { mapPropsToClasses } from '../../utils';
import './MenuLabel.css';

export interface MenuLabelProps extends TextProps {
  /**
   * The label content.
   */
  children?: React.ReactNode;
}

export const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ children, className, ...other }, ref) => (
    <div ref={ref}>
      <Text
        as="div"
        color="light"
        weight="semibold"
        size="tiny"
        className={mapPropsToClasses({ className }, 'menu-label')}
        {...other}
      >
        {children}
      </Text>
    </div>
  ),
);

MenuLabel.displayName = 'MenuLabel';
