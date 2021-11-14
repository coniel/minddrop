import React, { FC } from 'react';
import { IconName } from '@minddrop/icons';
import { Icon, IconProps } from '../Icon';
import './IconRenderer.css';

interface IconRendererIconProps {
  /**
   * The icon to render.
   */
  icon: React.ReactElement;

  iconName?: never;
}

interface IconRendererIconNameProps extends Omit<IconProps, 'name'> {
  /**
   * The name of a MindDrop icon.
   */
  iconName: IconName;

  icon?: never;
}

type IconRendererProps = IconRendererIconProps | IconRendererIconNameProps;

export const IconRenderer: FC<IconRendererProps> = ({
  icon,
  iconName,
  ...other
}) => {
  if (iconName) {
    return <Icon name={iconName} {...other} />;
  }

  return icon;
};
