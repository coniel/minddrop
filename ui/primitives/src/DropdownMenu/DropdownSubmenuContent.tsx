import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React from 'react';
import { Menu } from '../Menu';

/* --- DropdownSubmenuContent ---
   Styled popup panel for nested submenus.
   Props are defined independently (not derived from
   DropdownMenuContentProps) to avoid a circular import. */

export interface DropdownSubmenuContentProps extends MenuPrimitive.Popup.Props {
  /*
   * Minimum width of the submenu panel in pixels.
   */
  minWidth?: number;

  /*
   * Class name applied to the submenu panel.
   */
  className?: string;
}

export const DropdownSubmenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownSubmenuContentProps
>(({ children, minWidth, className, ...other }, ref) => (
  <MenuPrimitive.Popup
    ref={ref}
    render={
      <Menu style={{ minWidth }} className={className}>
        {children}
      </Menu>
    }
    {...other}
  />
));

DropdownSubmenuContent.displayName = 'DropdownSubmenuContent';
