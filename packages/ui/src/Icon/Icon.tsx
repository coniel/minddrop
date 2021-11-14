import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { useIcons, IconName } from '@minddrop/icons';
import { TextColor } from '../types';
import './Icon.css';

export interface IconProps extends React.HTMLAttributes<SVGElement> {
  /**
   * The name of the icon.
   */
  name: IconName;

  /**
   * The color of the icon, matching Text colors.
   * `current-color` will use the color of the surrounding text.
   */
  color?: TextColor | 'current-color';
}

export const Icon: FC<IconProps> = ({
  children,
  className,
  name,
  color = 'current-color',
  ...other
}) => {
  const icons = useIcons();

  const Component = icons[name];

  return (
    <Component
      data-testid="icon"
      className={mapPropsToClasses({ className, color }, 'icon')}
      {...other}
    />
  );
};
