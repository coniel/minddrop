import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React from 'react';

/* --- ContextMenuTrigger ---
   Marks the right-click target area. Wraps its children in a
   `div` by default; pass `render` instead to merge the trigger
   onto an element which is already there, rather than adding a
   wrapper to the layout. */

export type ContextMenuTriggerProps = ContextMenuPrimitive.Trigger.Props;

export const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuTriggerProps
>((props, ref) => <ContextMenuPrimitive.Trigger ref={ref} {...props} />);

ContextMenuTrigger.displayName = 'ContextMenuTrigger';
