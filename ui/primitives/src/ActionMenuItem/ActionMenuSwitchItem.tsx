import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC } from 'react';
import { SwitchMenuItem, SwitchMenuItemProps } from '../Menu/SwitchMenuItem';

/* ============================================================
   TYPES
   ============================================================ */

export interface ActionMenuSwitchItemProps
  extends Omit<SwitchMenuItemProps, 'onClick'> {
  /**
   * Prevents interaction.
   */
  disabled?: boolean;
}

/* ============================================================
   ACTION MENU SWITCH ITEM
   Wraps Menu.CheckboxItem with a styled SwitchMenuItem.
   Base UI handles keyboard, toggle state, aria, and
   closeOnClick={false} by default.
   ============================================================ */

/** Renders a Base UI Menu.CheckboxItem with a styled SwitchMenuItem. */
export const ActionMenuSwitchItem: FC<ActionMenuSwitchItemProps> = ({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...other
}) => (
  <MenuPrimitive.CheckboxItem
    checked={checked}
    defaultChecked={defaultChecked}
    onCheckedChange={onCheckedChange}
    disabled={disabled}
    render={<SwitchMenuItem checked={checked} disabled={disabled} {...other} />}
  />
);
