import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Text } from '../../Text';
import {
  KeyboardAccessibleClickHandler,
  createKeydownClickHandler,
} from '../../utils';
import './Breadcrumb.css';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * The breadcrumb label.
   */
  label: React.ReactNode;

  /**
   * The breadcrumb icon.
   */
  icon?: React.ReactNode;

  /**
   * Callback fired when the breadcrumb is clicked
   * or activated using the keyboard.
   */
  onClick?: KeyboardAccessibleClickHandler;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  label,
  icon,
  className,
  onClick,
  onKeyDown,
  ...other
}) => (
  <li
    role="button"
    tabIndex={0}
    className={mapPropsToClasses({ className }, 'breadcrumb')}
    onClick={onClick}
    onKeyDown={createKeydownClickHandler(onClick, onKeyDown)}
    {...other}
  >
    {icon && <span className="breadcrumb-icon">{icon}</span>}
    <Text color="light" weight="medium">
      {label}
    </Text>
  </li>
);
