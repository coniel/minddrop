import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React from 'react';

/* --- DropdownMenuTrigger ---
   Wraps Base UI's Menu.Trigger so consumers can pass a
   ReactElement as `children` instead of `render`. */

export interface DropdownMenuTriggerProps
  extends Omit<MenuPrimitive.Trigger.Props, 'children'> {
  children?: React.ReactElement;
}

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ children, render, ...other }, ref) => (
  <MenuPrimitive.Trigger ref={ref} render={children || render} {...other} />
));

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
