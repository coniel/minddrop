import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Text, TextProps } from '../../Text';
import './MenuLabel.css';

export interface MenuLabelProps extends TextProps {
  /**
   * The label content.
   */
  children?: React.ReactNode;
}

export const MenuLabel: FC<MenuLabelProps> = ({
  children,
  className,
  ...other
}) => {
  return (
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
  );
};
