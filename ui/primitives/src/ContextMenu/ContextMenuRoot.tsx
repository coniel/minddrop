import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';

/* --- ContextMenuRoot ---
   The raw Base UI root — use for advanced composition.
   For simple cases, use the convenience ContextMenu instead. */

export type ContextMenuRootProps = ContextMenuPrimitive.Root.Props;

export const ContextMenuRoot = ContextMenuPrimitive.Root;
