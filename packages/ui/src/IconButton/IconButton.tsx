import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './IconButton.css';

export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * The icon.
   */
  children: React.ReactNode;

  /**
   * The color of the icon.
   */
  color?: 'neutral' | 'light' | 'contrast';

  /**
   * Disables the button.
   */
  disabled?: boolean;

  /**
   * Makes the icon button accessible by providing a meaningful label
   * which is announced correctly by screen readers.
   */
  label: string;

  /**
   * The size of the icon button.
   */
  size?: 'small' | 'medium';
}

export const IconButton: FC<IconButtonProps> = ({
  children,
  color,
  className,
  label,
  size,
  ...other
}) => {
  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={label}
      className={mapPropsToClasses({ className, color, size }, 'icon-button')}
      {...other}
    >
      {children}
    </button>
  );
};
