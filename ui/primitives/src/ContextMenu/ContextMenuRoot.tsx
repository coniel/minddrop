import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC, useCallback, useRef } from 'react';
import { MenuFocusContext, useMenuFocusState } from '../Menu/MenuFocusContext';
import { PopupCloseContext } from '../PopupCloseContext';

/* --- ContextMenuRoot ---
   Base UI's root - use for advanced composition. For simple
   cases, use the convenience ContextMenu instead.

   Provides the menu focus context: while an item keeps the focus
   (e.g. a rename field), hovering items does not highlight them,
   which would move the focus onto them. Setting
   `highlightItemOnHover` overrides this.

   Provides the popup close context: closing from within a submenu
   closes the whole menu (e.g. after a searchable submenu's item
   is selected). */

export type ContextMenuRootProps = ContextMenuPrimitive.Root.Props;

export const ContextMenuRoot: FC<ContextMenuRootProps> = ({
  highlightItemOnHover,
  ...other
}) => {
  const actionsRef = useRef<MenuPrimitive.Root.Actions>(null);
  const focusState = useMenuFocusState();

  const close = useCallback(() => {
    actionsRef.current?.close();
  }, []);

  return (
    <MenuFocusContext.Provider value={focusState}>
      <PopupCloseContext.Provider value={close}>
        <ContextMenuPrimitive.Root
          actionsRef={actionsRef}
          highlightItemOnHover={highlightItemOnHover ?? !focusState.keepsFocus}
          {...other}
        />
      </PopupCloseContext.Provider>
    </MenuFocusContext.Provider>
  );
};
