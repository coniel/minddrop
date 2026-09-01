import React, { useMemo, useRef, useState } from 'react';
import { TranslationKey, i18n } from '@minddrop/i18n';
import { ContentIcon } from '../ContentIcon';
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
} from '../ContextMenu';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { IconProp, IconRenderer } from '../IconRenderer';
import { KeyboardShortcut } from '../KeyboardShortcut';
import { MenuTargetContext, useActionsVisibleHold } from '../MenuTargetContext';
import {
  Anchor,
  MenuContents,
  MenuOpenChangeDetails,
  TranslatableNode,
} from '../types';
import {
  propsToClass,
  resolveElementAnchor,
  resolveEventAnchor,
} from '../utils';
import { MenuItemDropdownMenu } from './MenuItemDropdownMenu';

export interface MenuItemPopoverContext {
  /*
   * The anchor the item's follow-up popovers position themselves
   * against, matching the menu which opened them: the right click
   * position for the context menu, the options button for the
   * dropdown.
   */
  anchor: Anchor;
}

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
   * The item's menu, opened both from a hover-revealed options
   * button and as the item's context menu.
   */
  menu?: MenuContents;

  /*
   * Accessible label of the options button opening `menu`.
   * @default 'actions.options'
   */
  menuLabel?: TranslationKey;

  /*
   * Popovers opened by the item's menu actions, anchored via the
   * given context.
   */
  popovers?: (context: MenuItemPopoverContext) => React.ReactNode;

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
      menu,
      menuLabel = 'actions.options',
      muted,
      popovers,
      role = 'menuitem',
      size,
      stringDescription,
      stringLabel,
      trailingIcon,
      ...other
    },
    ref,
  ) => {
    const optionsButtonRef = useRef<HTMLButtonElement>(null);
    const contextMenuHoldRef = useRef<VoidFunction | null>(null);
    const [menuAnchor, setMenuAnchor] = useState<Anchor | null>(null);
    const { actionsVisible, menuTarget } = useActionsVisibleHold();

    // The item is highlighted with its actions shown while any
    // hold is active
    const forceActionsVisible = forceActionsVisibleProp || actionsVisible;

    // Popovers open where the menu that led to them did: at the
    // right click position for the context menu, at the options
    // button for the dropdown
    const popoverAnchor = menuAnchor ?? optionsButtonRef;

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

    // Record where the context menu was opened, so the popovers it
    // leads to open at the same point
    function handleContextMenuOpenChange(
      open: boolean,
      eventDetails: MenuOpenChangeDetails,
    ) {
      if (open) {
        setMenuAnchor(resolveEventAnchor(eventDetails.event));

        // Highlight the item the menu belongs to while it is open
        contextMenuHoldRef.current = menuTarget.holdActionsVisible();

        return;
      }

      contextMenuHoldRef.current?.();
      contextMenuHoldRef.current = null;
    }

    // Anchor the dropdown's popovers at the options button it was
    // opened from, frozen in place because the button hides again
    // as soon as the item loses hover
    function handleDropdownOpenChange(open: boolean) {
      if (open) {
        setMenuAnchor(resolveElementAnchor(optionsButtonRef.current));
      }
    }

    const item = (
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
            <span className="menu-item-description">{resolvedDescription}</span>
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
          <Icon name="chevron-right" className="menu-item-submenu-indicator" />
        )}
        {(actions || menu) && (
          <div
            className="menu-item-actions"
            onClick={(event) => event.stopPropagation()}
          >
            {actions}

            {/* Opens the item's menu */}
            {menu && (
              <MenuItemDropdownMenu onOpenChange={handleDropdownOpenChange}>
                <DropdownMenuTrigger>
                  <IconButton
                    ref={optionsButtonRef}
                    icon="ellipsis"
                    size="sm"
                    variant="ghost"
                    color="neutral"
                    label={menuLabel}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuPositioner side="bottom" align="start">
                    <DropdownMenuContent content={menu} />
                  </DropdownMenuPositioner>
                </DropdownMenuPortal>
              </MenuItemDropdownMenu>
            )}
          </div>
        )}
      </div>
    );

    return (
      <MenuTargetContext.Provider value={menuTarget}>
        {menu ? (
          /* The menu doubles as the item's context menu, merged
             onto the item itself rather than wrapping it */
          <ContextMenuRoot onOpenChange={handleContextMenuOpenChange}>
            <ContextMenuTrigger render={item} />
            <ContextMenuPortal>
              <ContextMenuPositioner>
                <ContextMenuContent content={menu} />
              </ContextMenuPositioner>
            </ContextMenuPortal>
          </ContextMenuRoot>
        ) : (
          item
        )}

        {/* Popovers opened by the menu's actions */}
        {popovers?.({ anchor: popoverAnchor })}
      </MenuTargetContext.Provider>
    );
  },
);

MenuItem.displayName = 'MenuItem';
