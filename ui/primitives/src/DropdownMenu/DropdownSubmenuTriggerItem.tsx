import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC } from 'react';
import { IconProp } from '../IconRenderer';
import { useMenuKeepsFocus } from '../Menu/MenuFocusContext';
import { MenuItem } from '../Menu/MenuItem';
import { TranslatableNode } from '../types';

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
  const keepsFocus = useMenuKeepsFocus();
  const focusesOnHover = focusOnHover ?? !keepsFocus;

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
          label={label}
          stringLabel={stringLabel}
          detail={detail}
          stringDetail={stringDetail}
          icon={icon}
          contentIcon={contentIcon}
          disabled={disabled}
          trailingIcon={trailingIcon}
        />
      }
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      {...other}
    />
  );
};
