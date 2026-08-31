import React, { useMemo, useState } from 'react';
import { i18n } from '@minddrop/i18n';
import { createContext } from '@minddrop/utils';
import { ContentIcon } from '../ContentIcon';
import { Icon } from '../Icon';
import { IconProp, IconRenderer } from '../IconRenderer';
import { KeyboardShortcut } from '../KeyboardShortcut';
import { TranslatableNode } from '../types';
import { propsToClass } from '../utils';

export interface MenuItemContext {
  /*
   * Takes a hold keeping the item's actions visible, returning a
   * release function. The actions stay visible while any hold is
   * active, so overlapping popups (e.g. a dropdown handing over
   * to a popover) do not hide their anchor.
   */
  holdActionsVisible: () => VoidFunction;
}

const [hook, Provider] = createContext<MenuItemContext>();

export const useMenuItemContext = hook;

export interface MenuItemProps {
  /*
   * Label text. Strings are treated as i18n keys and translated.
   * Falls back to children if not provided.
   */
  label?: TranslatableNode;

  /*
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label` and `children`.
   */
  stringLabel?: string;

  /*
   * Label content. Used when `label` i18n key is not provided.
   */
  children?: React.ReactNode;

  /*
   * Supporting text rendered below the label, for items whose label alone
   * does not say what they are. Strings are treated as i18n keys and
   * translated.
   */
  description?: TranslatableNode;

  /*
   * Plain string description rendered as-is without i18n translation.
   * Takes priority over `description`.
   */
  stringDescription?: string;

  /*
   * Icon for the item.
   */
  icon?: IconProp;

  /*
   * Stringified content icon.
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
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
   * Trailing element rendered after the label, before the
   * keyboard shortcut and submenu indicator.
   */
  trailingIcon?: React.ReactNode;

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
   * - `comfortable` - 2rem height (default)
   * - `compact`     - 1.75rem height, for dense menus
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
   * Overrides the default ARIA role (`menuitem`).
   */
  role?: React.AriaRole;

  /*
   * ARIA checked state for radio/checkbox item roles.
   */
  'aria-checked'?: boolean | 'true' | 'false' | 'mixed';

  /*
   * Mouse move handler.
   */
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;

  /*
   * Mouse leave handler.
   */
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;

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
      description,
      disabled,
      forceActionsVisible: forceActionsVisibleProp,
      hasSubmenu,
      icon,
      keyboardShortcut,
      label,
      muted,
      role = 'menuitem',
      size,
      stringDescription,
      stringLabel,
      trailingIcon,
      ...other
    },
    ref,
  ) => {
    const [actionsVisibleHolds, setActionsVisibleHolds] = useState(0);

    // The actions are visible while any hold is active
    const forceActionsVisible =
      forceActionsVisibleProp || actionsVisibleHolds > 0;

    // Takes a hold on the actions' visibility. Releasing is
    // delayed so closing popups anchored to the actions do not
    // reposition, and a hold taken in the meantime keeps them
    // visible throughout
    const holdActionsVisible = React.useCallback(() => {
      setActionsVisibleHolds((holds) => holds + 1);

      let released = false;

      return () => {
        // Releases only count down once
        if (released) {
          return;
        }

        released = true;

        window.setTimeout(() => {
          setActionsVisibleHolds((holds) => holds - 1);
        }, 100);
      };
    }, []);

    // Resolve the display label from the available label sources
    const resolvedLabel = useMemo(() => {
      if (stringLabel) {
        return stringLabel;
      }

      if (label) {
        if (typeof label === 'string') {
          return i18n.t(label);
        }

        return label;
      }

      return children;
    }, [stringLabel, label, children]);

    // Resolve the supporting text from the available sources
    const resolvedDescription = useMemo(() => {
      if (stringDescription) {
        return stringDescription;
      }

      if (typeof description === 'string') {
        return i18n.t(description);
      }

      return description;
    }, [stringDescription, description]);

    return (
      <Provider value={{ holdActionsVisible }}>
        <div
          ref={ref}
          role={role}
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
          {icon && <IconRenderer className="menu-item-icon" icon={icon} />}
          {contentIcon && (
            <ContentIcon className="menu-item-icon" icon={contentIcon} />
          )}
          {resolvedDescription ? (
            <span className="menu-item-text">
              <span className="menu-item-label">{resolvedLabel}</span>
              <span className="menu-item-description">
                {resolvedDescription}
              </span>
            </span>
          ) : (
            <span className="menu-item-label">{resolvedLabel}</span>
          )}
          {trailingIcon}
          {keyboardShortcut && (
            <KeyboardShortcut
              color="muted"
              size="xs"
              weight="medium"
              keys={keyboardShortcut}
            />
          )}
          {hasSubmenu && (
            <Icon
              name="chevron-right"
              className="menu-item-submenu-indicator"
            />
          )}
          {actions && (
            <div
              className="menu-item-actions"
              onClick={(event) => event.stopPropagation()}
            >
              {actions}
            </div>
          )}
        </div>
      </Provider>
    );
  },
);

MenuItem.displayName = 'MenuItem';
