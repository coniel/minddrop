import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { IconName } from '@minddrop/icons';
import { Icon } from '../Icon';
import './IconButton.css';

export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * The name of the icon to render.
   */
  icon?: IconName;

  /**
   * Icon can also be passed in as a child for more control.
   * Children are not rendered if the `icon` prop is present.
   */
  children?: React.ReactNode;

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
  (
    { icon, children, color, component, className, label, size, ...other },
    ref,
  ) => {
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
        {icon ? <Icon name={icon} /> : children}
      </Component>
    );
  },
);
