import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Text } from '../../Text';
import { KeyboardShortcut } from '../../KeyboardShortcut';
import { IconProp, IconRenderer } from '../../IconRenderer';
import './MenuItem.css';
import { Icon } from '../../Icon';

export interface MenuItemProps {
  /**
   * The item label.
   */
  label: React.ReactNode;

  /**
   * The item description.
   */
  description?: React.ReactNode;

  /**
   * Icon for the item.
   */
  icon?: IconProp;

  /**
   * If `true`, renders a submenu indicator at the end of the item.
   */
  hasSubmenu?: boolean;

  /**
   * The keyboard shortcut for the action.
   */
  keyboardShortcut?: string[];

  /**
   * Renders at the end of the item. Used to indicate when a menu
   * item is checked.
   */
  itemIndicator?: React.ReactNode;

  /**
   * When `true`, prevents the user from interacting with the item.
   */
  disabled?: boolean;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      className,
      disabled,
      hasSubmenu,
      label,
      description,
      icon,
      itemIndicator,
      keyboardShortcut,
      ...other
    },
    ref,
  ) => (
    <div
      ref={ref}
      role="menuitem"
      className={mapPropsToClasses(
        { className, disabled, hasSubmenu },
        'menu-item',
      )}
      {...other}
    >
      <div className="label-container">
        <IconRenderer className="item-icon" icon={icon} />
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
          <Icon
            name="chevron-right"
            className="submenu-indicator"
            data-testid="submenu-indicator"
          />
        )}
        {itemIndicator}
      </div>
      {description && <div className="description">{description}</div>}
    </div>
  ),
);

MenuItem.displayName = 'MenuItem';
