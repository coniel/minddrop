import React from 'react';
import { Icon } from '../Icon';
import { MenuItem, MenuItemProps } from './MenuItem';

/* ============================================================
   MENU CHECK ITEM
   Convenience wrapper around MenuItem that renders a check
   icon on the left when checked. Supports controlled and
   uncontrolled usage.

   When used inside an ActionMenuCheckItem, toggle and
   keyboard are handled by Base UI's CheckboxItem - this
   component is purely presentational in that case.
   ============================================================ */

export interface MenuCheckItemProps
  extends Omit<MenuItemProps, 'active' | 'trailingIcon'> {
  /**
   * Controlled checked state.
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled usage.
   */
  defaultChecked?: boolean;

  /**
   * Callback fired when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;
}

export const MenuCheckItem = React.forwardRef<
  HTMLDivElement,
  MenuCheckItemProps
>(
  (
    {
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
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

    /* Toggle handler - clicking anywhere on the row toggles the check.
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
        className={`check-menu-item${className ? ` ${className}` : ''}`}
        trailingIcon={<Icon name="check" className="check-menu-item-icon" />}
        onClick={other.onClick ?? handleClick}
      />
    );
  },
);

MenuCheckItem.displayName = 'MenuCheckItem';
