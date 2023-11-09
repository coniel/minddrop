import React, { FC } from 'react';
import { UiIconName } from '@minddrop/icons';
import { Icon, IconProps } from '../Icon';
import './IconRenderer.css';

export type IconProp = UiIconName | React.ReactElement;

interface IconRendererProps extends Omit<IconProps, 'name'> {
  /**
   * The icon to render.
   */
  icon?: IconProp;
}

export const IconRenderer: FC<IconRendererProps> = ({
  icon,
  className,
  ...other
}) => {
  if (typeof icon === 'string') {
    return <Icon name={icon} className={className} {...other} />;
  }

  if (!icon) {
    return null;
  }

  return className
    ? React.cloneElement(icon, {
        className: `${className}${
          icon.props.className ? ` ${icon.props.className}` : ''
        }`,
      })
    : icon;
};
