import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { FC } from 'react';
import { MenuFocusContext, useMenuFocusState } from '../Menu/MenuFocusContext';

/* --- ContextMenuRoot ---
   Base UI's root - use for advanced composition. For simple
   cases, use the convenience ContextMenu instead.

   Provides the menu focus context: while an item keeps the focus
   (e.g. a rename field), hovering items does not highlight them,
   which would move the focus onto them. Setting
   `highlightItemOnHover` overrides this. */

export type ContextMenuRootProps = ContextMenuPrimitive.Root.Props;

export const ContextMenuRoot: FC<ContextMenuRootProps> = ({
  highlightItemOnHover,
  ...other
}) => {
  const focusState = useMenuFocusState();

  return (
    <MenuFocusContext.Provider value={focusState}>
      <ContextMenuPrimitive.Root
        highlightItemOnHover={highlightItemOnHover ?? !focusState.keepsFocus}
        {...other}
      />
    </MenuFocusContext.Provider>
  );
};
