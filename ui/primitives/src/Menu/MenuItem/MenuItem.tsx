import React from 'react';
import { Icon } from '../../Icon';
import { IconProp, IconRenderer } from '../../IconRenderer';
import { KeyboardShortcut } from '../../KeyboardShortcut';
import { Text } from '../../Text';
import { mapPropsToClasses } from '../../utils';
import './MenuItem.css';
import { i18n } from '@minddrop/i18n';
import { ContentIcon } from '../../ContentIcon';

export interface MenuItemProps {
  /**
   * The i18n key for the label text. If not provided, children will be used.
   */
  label?: string;

  /**
   * The menu item label content. Used if `label` is not provided.
   */
  children?: React.ReactNode;

  /**
   * Icon for the item.
   */
  icon?: IconProp;

  /**
   * Stringified content icon for the item.
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  contentIcon?: string;

  /**
   * If `true`, styles the item as active/selected.
   * @default false
   */
  active?: boolean;

  /**
   * If `true`, renders a submenu indicator at the end of the item.
   * @default false
   */
  hasSubmenu?: boolean;

  /**
   * The keyboard shortcut for the action.
   */
  keyboardShortcut?: string[];

  /**
   * When `true`, prevents the user from interacting with the item.
   * @default false
   */
  disabled?: boolean;

  /**
   * The size of the menu item.
   * @default 'comfortable'
   */
  size?: 'compact' | 'comfortable';

  /**
   * When `true`, uses muted colors for the item.
   * @default false
   */
  muted?: boolean;

  /**
   * When `true`, styles the item to indicate a dangerous action.
   * @default false
   */
  danger?: boolean;

  /**
   * Additional actions to display on the right side of the item when hovered.
   */
  actions?: React.ReactNode;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      actions,
      active,
      children,
      className,
      contentIcon,
      danger,
      disabled,
      hasSubmenu,
      icon,
      keyboardShortcut,
      label,
      muted,
      size,
      ...other
    },
    ref,
  ) => (
    <div
      ref={ref}
      role="menuitem"
      className={mapPropsToClasses(
        { className, disabled, hasSubmenu, active, size, muted, danger },
        'menu-item',
      )}
      {...other}
    >
      {icon && <IconRenderer className="item-icon" icon={icon} />}
      {contentIcon && <ContentIcon className="item-icon" icon={contentIcon} />}
      <Text size="small" color="inherit" weight="inherit" className="label">
        {label ? i18n.t(label) : children}
      </Text>
      {keyboardShortcut && (
        <KeyboardShortcut
          color="muted"
          size="tiny"
          weight="medium"
          keys={keyboardShortcut}
        />
      )}
      {hasSubmenu && (
        <Icon name="chevron-right" className="submenu-indicator" />
      )}
      {actions && <div className="actions">{actions}</div>}
    </div>
  ),
);

MenuItem.displayName = 'MenuItem';
