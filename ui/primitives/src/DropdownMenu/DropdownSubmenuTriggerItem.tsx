import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC } from 'react';
import { IconProp } from '../IconRenderer';
import { MenuItem } from '../Menu/MenuItem';
import { TranslatableNode } from '../types';

/* --- DropdownSubmenuTriggerItem ---
   The trigger item that opens a nested submenu. */

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
   * Icon for the item.
   */
  icon?: IconProp;

  /**
   * Content icon string displayed before the label.
   * Supports emoji, asset, and other content icon formats.
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
}

export const DropdownSubmenuTriggerItem: FC<
  DropdownSubmenuTriggerItemProps
> = ({
  label,
  stringLabel,
  icon,
  contentIcon,
  disabled,
  trailingIcon,
  ...other
}) => (
  <MenuPrimitive.SubmenuTrigger
    render={
      <MenuItem
        hasSubmenu
        label={label}
        stringLabel={stringLabel}
        icon={icon}
        contentIcon={contentIcon}
        disabled={disabled}
        trailingIcon={trailingIcon}
      />
    }
    disabled={disabled}
    {...other}
  />
);
