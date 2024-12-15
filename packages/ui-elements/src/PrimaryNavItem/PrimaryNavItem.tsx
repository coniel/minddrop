import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { IconProp, IconRenderer } from '../IconRenderer';
import { Text } from '../Text';
import {
  KeyboardAccessibleClickHandler,
  createKeydownClickHandler,
} from '../utils';
import './PrimaryNavItem.css';

export interface PrimaryNavItemProps
  extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * The item label.
   */
  label: React.ReactNode;

  /**
   * The item icon.
   */
  icon?: IconProp;

  /**
   * If true, the item will have active styling and
   * accessibility indicators.
   */
  active?: boolean;

  /**
   * Callback fired on click.
   */
  onClick?: KeyboardAccessibleClickHandler;
}

export const PrimaryNavItem: FC<PrimaryNavItemProps> = ({
  children,
  className,
  label,
  icon,
  active,
  onClick,
  onKeyDown,
  ...other
}) => (
  <li
    role="button"
    tabIndex={0}
    aria-current={active ? 'location' : undefined}
    className={mapPropsToClasses({ className, active }, 'primary-nav-item')}
    onClick={onClick}
    onKeyDown={createKeydownClickHandler(onClick, onKeyDown)}
    {...other}
  >
    <IconRenderer icon={icon} />
    <Text as="div" color="light" weight="medium" size="large" className="label">
      {label}
    </Text>
    {children}
  </li>
);
