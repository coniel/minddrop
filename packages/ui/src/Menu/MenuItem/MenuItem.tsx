import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Text } from '../../Text';
import { KeyboardShortcut } from '../../KeyboardShortcut';
import './MenuItem.css';

export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The item label.
   */
  label: React.ReactNode;

  /**
   * The item icon.
   */
  icon?: React.ReactNode;

  /**
   * If `true`, renders a submenu indicator at the end of the item.
   */
  hasSubmenu?: boolean;

  /**
   * The keyboard shortcut for the action.
   */
  keyboardShortcut?: string[];

  /**
   * When `true`, prevents the user from interacting with the item.
   */
  disabled?: boolean;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      children,
      className,
      disabled,
      hasSubmenu,
      label,
      icon,
      keyboardShortcut,
      ...other
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="menuitem"
        className={mapPropsToClasses(
          { className, disabled, hasSubmenu },
          'menu-item',
        )}
        {...other}
      >
        {icon && <span className="icon">{icon}</span>}
        <Text size="regular" className="label">
          {label}
        </Text>
        {keyboardShortcut && (
          <KeyboardShortcut
            color="light"
            size="tiny"
            weight="medium"
            keys={keyboardShortcut}
          />
        )}
        {hasSubmenu && (
          <span className="submenu-indicator" data-testid="submenu-indicator">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0076 18.353C9.76137 18.3512 9.51818 18.2871 9.294 18.1647C9.05155 18.0365 8.84497 17.8272 8.69896 17.5619C8.55295 17.2965 8.47367 16.9864 8.47058 16.6684V8.74448C8.47367 8.42653 8.55295 8.11637 8.69896 7.85103C8.84497 7.5857 9.05155 7.3764 9.294 7.24815C9.57298 7.09002 9.88336 7.02911 10.1898 7.07238C10.4962 7.11564 10.7863 7.26132 11.0271 7.49284L15.0266 11.4548C15.1834 11.6046 15.3101 11.795 15.3971 12.0117C15.4842 12.2284 15.5294 12.4659 15.5294 12.7064C15.5294 12.947 15.4842 13.1845 15.3971 13.4012C15.3101 13.6179 15.1834 13.8083 15.0266 13.9581L11.0271 17.9201C10.7388 18.2006 10.3788 18.3535 10.0076 18.353Z"
                fill="inherit"
              />
            </svg>
          </span>
        )}
      </div>
    );
  },
);
