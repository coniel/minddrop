import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC } from 'react';
import { MenuCheckItem, MenuCheckItemProps } from '../Menu/MenuCheckItem';

/* ============================================================
   TYPES
   ============================================================ */

export interface ActionMenuCheckItemProps
  extends Omit<MenuCheckItemProps, 'onClick'>,
    Record<string, unknown> {
  /**
   * Base UI primitive component used as the outer item.
   * Defaults to Menu.CheckboxItem. Pass Combobox.Item for
   * combobox usage.
   * @default MenuPrimitive.CheckboxItem
   */
  component?: React.ElementType;

  /**
   * Prevents interaction.
   */
  disabled?: boolean;
}

/* ============================================================
   ACTION MENU CHECK ITEM
   Wraps Menu.CheckboxItem with a styled MenuCheckItem.
   Base UI handles keyboard, toggle state, aria, and
   closeOnClick={false} by default.
   ============================================================ */

/** Renders a Base UI Menu.CheckboxItem with a styled MenuCheckItem. */
export const ActionMenuCheckItem: FC<ActionMenuCheckItemProps> = ({
  component: Component = MenuPrimitive.CheckboxItem,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...other
}) => (
  <Component
    checked={checked}
    defaultChecked={defaultChecked}
    onCheckedChange={onCheckedChange}
    disabled={disabled}
    {...other}
    render={<MenuCheckItem checked={checked} disabled={disabled} {...other} />}
  />
);
