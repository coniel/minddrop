import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React from 'react';
import './ContextMenu.css';

/* --- ContextMenuPositioner ---
   Wraps Base UI's ContextMenu.Positioner with a default class
   name for z-index layering. */

export type ContextMenuPositionerProps = ContextMenuPrimitive.Positioner.Props;

export const ContextMenuPositioner = React.forwardRef<
  HTMLDivElement,
  ContextMenuPositionerProps
>((props, ref) => (
  <ContextMenuPrimitive.Positioner
    ref={ref}
    className="context-menu-positioner"
    {...props}
  />
));

ContextMenuPositioner.displayName = 'ContextMenuPositioner';
