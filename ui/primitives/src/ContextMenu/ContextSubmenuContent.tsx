import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React from 'react';
import { Menu } from '../Menu';

/* --- ContextSubmenuContent ---
   Styled popup panel for nested submenus.
   Props are defined independently (not derived from
   ContextMenuContentProps) to avoid a circular import. */

export interface ContextSubmenuContentProps
  extends ContextMenuPrimitive.Popup.Props {
  /*
   * Minimum width of the submenu panel in pixels.
   */
  minWidth?: number;

  /*
   * Class name applied to the submenu panel.
   */
  className?: string;
}

export const ContextSubmenuContent = React.forwardRef<
  HTMLDivElement,
  ContextSubmenuContentProps
>(({ children, minWidth, className, ...other }, ref) => (
  <ContextMenuPrimitive.Popup
    ref={ref}
    render={
      <Menu style={{ minWidth }} className={className}>
        {children}
      </Menu>
    }
    {...other}
  />
));

ContextSubmenuContent.displayName = 'ContextSubmenuContent';
