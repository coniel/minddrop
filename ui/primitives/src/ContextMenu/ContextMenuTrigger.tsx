import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React from 'react';

/* --- ContextMenuTrigger ---
   Wraps children as the right-click target area.
   Unlike DropdownMenuTrigger, this uses children rather than
   a render prop since the trigger is a region, not a button. */

export interface ContextMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuTriggerProps
>(({ children, className }, ref) => (
  <ContextMenuPrimitive.Trigger ref={ref} className={className}>
    {children}
  </ContextMenuPrimitive.Trigger>
));

ContextMenuTrigger.displayName = 'ContextMenuTrigger';
