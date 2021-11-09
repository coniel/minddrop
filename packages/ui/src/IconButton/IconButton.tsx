import React from 'react';
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
   * The component used for the root node. Either a string to use a
   * HTML element or a component.
   */
  component?: React.ElementType;

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

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, color, component, className, label, size, ...other }, ref) => {
    const Component = component || 'button';

    return (
      <Component
        type="button"
        ref={ref}
        tabIndex={0}
        aria-label={label}
        className={mapPropsToClasses({ className, color, size }, 'icon-button')}
        {...other}
      >
        {children}
      </Component>
    );
  },
);
