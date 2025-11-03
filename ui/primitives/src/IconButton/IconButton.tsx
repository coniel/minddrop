import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/icons';
import { Icon } from '../Icon';
import { mapPropsToClasses } from '../utils';
import './IconButton.css';

export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * The name of the icon to render.
   */
  icon?: UiIconName;

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
  as?: React.ElementType;

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
   * The size of the icon button. The large size is intended for use
   * alongside TextField components, matching their height.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The variant of the icon button.
   */
  variant?: 'regular' | 'filled' | 'outlined';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, children, color, as, className, label, size, variant, ...other },
    ref,
  ) => {
    const { t } = useTranslation();
    const Component = as || 'button';

    return (
      <Component
        type="button"
        ref={ref}
        tabIndex={0}
        aria-label={t(label)}
        className={mapPropsToClasses(
          { className, color, size, variant },
          'icon-button',
        )}
        {...other}
      >
        {icon ? <Icon name={icon} /> : children}
      </Component>
    );
  },
);

IconButton.displayName = 'IconButton';
