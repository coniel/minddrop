import React, { FC } from 'react';
import { IconName } from '@minddrop/icons';
import { Icon, IconProps } from '../Icon';
import './IconRenderer.css';

interface IconRendererProps extends Omit<IconProps, 'name'> {
  /**
   * The icon to render.
   */
  icon?: React.ReactElement;

  /**
   * The name of a MindDrop icon.
   */
  iconName?: IconName;
}

export const IconRenderer: FC<IconRendererProps> = ({
  icon,
  iconName,
  ...other
}) => {
  if (iconName) {
    return <Icon name={iconName} {...other} />;
  }

  return icon || null;
};
