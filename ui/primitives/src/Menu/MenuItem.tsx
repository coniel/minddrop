import React, { useState } from 'react';
import { i18n } from '@minddrop/i18n';
import { createContext } from '@minddrop/utils';
import { ContentIcon } from '../ContentIcon';
import { Icon } from '../Icon';
import { IconProp, IconRenderer } from '../IconRenderer';
import { KeyboardShortcut } from '../KeyboardShortcut';
import { propsToClass } from '../utils';

export interface MenuItemContext {
  /*
   * Allows programmatic control of the visibility of the actions menu.
   * Useful for maintaining visibility when opening a nested dropdown.
   */
  setForceActionsVisible: (visible: boolean) => void;
}

const [hook, Provider] = createContext<MenuItemContext>();

export const useMenuItemContext = hook;

export interface MenuItemProps {
  /*
   * i18n key for the label. Falls back to children if not provided.
   */
  label?: string;

  /*
   * Label content. Used when `label` i18n key is not provided.
   */
  children?: React.ReactNode;

  /*
   * Icon for the item.
   */
  icon?: IconProp;

  /*
   * Stringified content icon.
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  contentIcon?: string;

  /*
   * Renders the item in a selected/active state.
   * @default false
   */
  active?: boolean;

  /*
   * Renders a submenu chevron indicator.
   * @default false
   */
  hasSubmenu?: boolean;

  /*
   * Keyboard shortcut displayed at the end of the item.
   */
  keyboardShortcut?: string[];

  /*
   * Prevents interaction with the item.
   * @default false
   */
  disabled?: boolean;

  /*
   * Density of the item.
   * - `comfortable` — 2rem height (default)
   * - `compact`     — 1.75rem height, for dense menus
   * @default 'comfortable'
   */
  size?: 'compact' | 'comfortable';

  /*
   * Renders label in muted color with medium weight.
   * @default false
   */
  muted?: boolean;

  /*
   * Applies danger color on hover to indicate a destructive action.
   * @default false
   */
  danger?: boolean;

  /*
   * Additional actions revealed on hover, anchored to the right.
   */
  actions?: React.ReactNode;

  /*
   * Forces actions to remain visible. Useful when a nested dropdown
   * is open and the item would otherwise lose hover state.
   * @default false
   */
  forceActionsVisible?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * Click handler.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
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
      forceActionsVisible: forceActionsVisibleProp,
      hasSubmenu,
      icon,
      keyboardShortcut,
      label,
      muted,
      size,
      ...other
    },
    ref,
  ) => {
    const [forceActionsVisible, setForceActionsVisible] = useState(
      forceActionsVisibleProp,
    );

    return (
      <Provider value={{ setForceActionsVisible }}>
        <div
          ref={ref}
          role="menuitem"
          className={propsToClass('menu-item', {
            size,
            active,
            muted,
            danger,
            disabled,
            forceActionsVisible,
            className,
          })}
          aria-disabled={disabled}
          {...other}
        >
          {icon && <IconRenderer className="item-icon" icon={icon} />}
          {contentIcon && (
            <ContentIcon className="item-icon" icon={contentIcon} />
          )}
          <span className="label">{label ? i18n.t(label) : children}</span>
          {keyboardShortcut && (
            <KeyboardShortcut
              color="muted"
              size="xs"
              weight="medium"
              keys={keyboardShortcut}
            />
          )}
          {hasSubmenu && (
            <Icon name="chevron-right" className="submenu-indicator" />
          )}
          {actions && (
            <div className="actions" onClick={(e) => e.stopPropagation()}>
              {actions}
            </div>
          )}
        </div>
      </Provider>
    );
  },
);

MenuItem.displayName = 'MenuItem';
