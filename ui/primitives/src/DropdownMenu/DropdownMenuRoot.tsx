import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC } from 'react';
import { MenuFocusContext, useMenuFocusState } from '../Menu/MenuFocusContext';

/* --- DropdownMenuRoot ---
   Base UI's root - use for advanced composition. For simple
   cases, use the convenience DropdownMenu instead.

   Provides the menu focus context: while an item keeps the focus
   (e.g. a rename field), hovering items does not highlight them,
   which would move the focus onto them. Setting
   `highlightItemOnHover` overrides this. */

export type DropdownMenuRootProps = MenuPrimitive.Root.Props;

export const DropdownMenuRoot: FC<DropdownMenuRootProps> = ({
  highlightItemOnHover,
  ...other
}) => {
  const focusState = useMenuFocusState();

  return (
    <MenuFocusContext.Provider value={focusState}>
      <MenuPrimitive.Root
        highlightItemOnHover={highlightItemOnHover ?? !focusState.keepsFocus}
        {...other}
      />
    </MenuFocusContext.Provider>
  );
};
