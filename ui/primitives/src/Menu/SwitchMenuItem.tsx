import React from 'react';
import { Switch, SwitchSize } from '../Switch';
import { MenuItem, MenuItemProps } from './MenuItem';

/* ============================================================
   SWITCH MENU ITEM
   Convenience wrapper around MenuItem that renders a toggle
   switch on the right (via trailingIcon). Clicking anywhere
   on the row toggles the switch. Supports controlled and
   uncontrolled usage.

   When used inside a SwitchMenuItemRenderer, toggle and
   keyboard are handled by Base UI's CheckboxItem — this
   component is purely presentational in that case.
   ============================================================ */

export interface SwitchMenuItemProps
  extends Omit<MenuItemProps, 'active' | 'trailingIcon'> {
  /*
   * Controlled checked state.
   */
  checked?: boolean;

  /*
   * Default checked state for uncontrolled usage.
   */
  defaultChecked?: boolean;

  /*
   * Callback fired when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /*
   * Size of the switch.
   * @default 'sm'
   */
  switchSize?: SwitchSize;
}

export const SwitchMenuItem = React.forwardRef<
  HTMLDivElement,
  SwitchMenuItemProps
>(
  (
    {
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      switchSize = 'sm',
      disabled,
      className,
      ...other
    },
    ref,
  ) => {
    /* Track internal state for uncontrolled usage */
    const [checkedInternal, setCheckedInternal] = React.useState(
      defaultChecked ?? false,
    );

    /* Use controlled value when provided, otherwise internal state */
    const checked = checkedProp !== undefined ? checkedProp : checkedInternal;

    /* Toggle handler — clicking anywhere on the row toggles the switch.
       Only used in standalone mode. When inside a renderer, Base UI's
       CheckboxItem handles the toggle and this handler is overridden
       by Base UI's merged onClick via {...other}. */
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      /* Prevent the menu from closing */
      event.preventDefault();

      const next = !checked;

      /* Update internal state for uncontrolled usage */
      if (checkedProp === undefined) {
        setCheckedInternal(next);
      }

      onCheckedChange?.(next);
    };

    return (
      <MenuItem
        role="menuitemcheckbox"
        aria-checked={checked}
        {...other}
        ref={ref}
        disabled={disabled}
        className={`switch-menu-item${className ? ` ${className}` : ''}`}
        trailingIcon={
          <Switch size={switchSize} checked={checked} disabled={disabled} />
        }
        onClick={other.onClick ?? handleClick}
      />
    );
  },
);

SwitchMenuItem.displayName = 'SwitchMenuItem';
