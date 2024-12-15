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
   * The label of the breadcrumb.
   */
  label: React.ReactNode;

  /**
   * Callback fired when the breadcrumb is clicked
   * or activated using the keyboard.
   */
  onClick?: KeyboardAccessibleClickHandler;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  label,
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
    <Text color="light">{label}</Text>
  </li>
);
