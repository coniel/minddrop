import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React from 'react';
import './DropdownMenu.css';

/* --- DropdownMenuPositioner ---
   Wraps Base UI's Menu.Positioner with a default class name
   for z-index layering. */

export type DropdownMenuPositionerProps = MenuPrimitive.Positioner.Props;

export const DropdownMenuPositioner = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPositionerProps
>((props, ref) => (
  <MenuPrimitive.Positioner
    ref={ref}
    className="dropdown-menu-positioner"
    {...props}
  />
));

DropdownMenuPositioner.displayName = 'DropdownMenuPositioner';
