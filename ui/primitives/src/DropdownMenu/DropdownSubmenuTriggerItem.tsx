import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC, useEffect, useId, useRef } from 'react';
import { ActionMenuItemProps } from '../ActionMenuItem';
import { IconProp } from '../IconRenderer';
import { useMenuKeepsFocus } from '../Menu/MenuFocusContext';
import { MenuItem } from '../Menu/MenuItem';
import { useOptionalMenuSearchContext } from '../Menu/MenuSearchContext';
import { TranslatableNode } from '../types';
import {
  DropdownSubmenuContextValue,
  useDropdownSubmenu,
} from './DropdownSubmenu';

/* --- DropdownSubmenuTriggerItem ---
   The trigger item that opens a nested submenu. */

type SubmenuTriggerMouseEnterHandler = NonNullable<
  MenuPrimitive.SubmenuTrigger.Props['onMouseEnter']
>;

export interface DropdownSubmenuTriggerItemProps
  extends Omit<MenuPrimitive.SubmenuTrigger.Props, 'children' | 'label'> {
  /**
   * Label text. Strings are treated as i18n keys and translated.
   */
  label?: TranslatableNode;

  /**
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /**
   * Muted text rendered after the label as part of it. Strings are
   * treated as i18n keys and translated.
   */
  detail?: TranslatableNode;

  /**
   * Plain string detail rendered as-is without i18n translation.
   * Takes priority over `detail`.
   */
  stringDetail?: string;

  /**
   * Icon for the item.
   */
  icon?: IconProp;

  /**
   * Content icon string displayed before the label.
   */
  contentIcon?: string;

  /**
   * Prevents interaction with the item.
   */
  disabled?: boolean;

  /**
   * Trailing element rendered after the label, before the
   * submenu chevron indicator.
   */
  trailingIcon?: React.ReactNode;

  /**
   * Whether the pointer entering the item moves the menu's focus onto
   * it. The hover styling is unaffected. Defaults to false while an
   * item of the menu keeps the focus (e.g. a rename field), true
   * otherwise.
   */
  focusOnHover?: boolean;
}

export const DropdownSubmenuTriggerItem: FC<
  DropdownSubmenuTriggerItemProps
> = ({
  label,
  stringLabel,
  detail,
  stringDetail,
  icon,
  contentIcon,
  disabled,
  trailingIcon,
  focusOnHover,
  onMouseEnter,
  ...other
}) => {
  const propsRef = useRef<ActionMenuItemProps>({ label, stringLabel });
  const submenuRef = useRef<DropdownSubmenuContextValue | null>(null);
  const id = useId();
  const keepsFocus = useMenuKeepsFocus();
  const menu = useOptionalMenuSearchContext();
  const focusesOnHover = focusOnHover ?? !keepsFocus;

  // Kept up to date on every render, so that neither changing
  // renews the registration.
  propsRef.current = { label, stringLabel };
  submenuRef.current = useDropdownSubmenu();

  // Told to the submenu, which returns the menu's highlight here
  // when it closes.
  if (submenuRef.current) {
    submenuRef.current.triggerIdRef.current = id;
  }

  const { register, unregister } = menu ?? {};

  // Take a place in a searchable menu's navigation, which runs over
  // registered items rather than Base UI's own. The search term is
  // not matched against the item: menus list a submenu's contents
  // flat while searching, leaving nothing for its trigger to open.
  useEffect(() => {
    if (!register || !unregister) {
      return undefined;
    }

    register(id, {
      propsRef,
      searchable: false,
      activate: () => submenuRef.current?.setOpen(true),
    });

    return () => unregister(id);
  }, [id, register, unregister]);

  const navProps = menu?.getItemNavProps(id) ?? null;

  // Cancel Base UI's own mouse enter handler, which activates the
  // trigger and focuses it, when focusing on hover is disabled.
  const handleMouseEnter: SubmenuTriggerMouseEnterHandler = (event) => {
    onMouseEnter?.(event);

    if (!focusesOnHover) {
      event.preventBaseUIHandler();
    }
  };

  return (
    <MenuPrimitive.SubmenuTrigger
      render={
        <MenuItem
          hasSubmenu
          data-menu-item={id}
          label={label}
          stringLabel={stringLabel}
          detail={detail}
          stringDetail={stringDetail}
          icon={icon}
          contentIcon={contentIcon}
          disabled={disabled}
          trailingIcon={trailingIcon}
          active={navProps?.highlighted}
        />
      }
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      {...other}
    />
  );
};
