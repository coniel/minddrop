import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC, useMemo, useRef, useState } from 'react';
import { useMenuKeepsFocus } from '../../Menu/MenuFocusContext';
import { useOnMenuItemHover } from '../../Menu/MenuItemHoverContext';
import { DropdownSubmenuContext } from './DropdownSubmenuContext';

/* --- DropdownSubmenu ---
   Base UI's Menu.SubmenuRoot for nesting menus, holding the open
   state here so that a menu navigated by keyboard can open and
   close it. Follows the parent menu's focus context: while an item
   of the parent keeps the focus, hovering the submenu's items does
   not highlight them. Setting `highlightItemOnHover` overrides
   this. */

export type DropdownSubmenuProps = MenuPrimitive.SubmenuRoot.Props;

type OpenChangeHandler = NonNullable<DropdownSubmenuProps['onOpenChange']>;

export const DropdownSubmenu: FC<DropdownSubmenuProps> = ({
  highlightItemOnHover,
  onOpenChange,
  ...other
}) => {
  const triggerIdRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const keepsFocus = useMenuKeepsFocus();

  // Close when the pointer moves onto another of the parent menu's
  // items. Base UI closes the branch itself when the item hovered is
  // one of its own, which a searchable menu's items are not.
  useOnMenuItemHover(() => setOpen(false));

  const submenu = useMemo(() => ({ setOpen, triggerIdRef }), []);

  const handleOpenChange: OpenChangeHandler = (nextOpen, eventDetails) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen, eventDetails);
  };

  return (
    <DropdownSubmenuContext.Provider value={submenu}>
      <MenuPrimitive.SubmenuRoot
        open={open}
        onOpenChange={handleOpenChange}
        highlightItemOnHover={highlightItemOnHover ?? !keepsFocus}
        {...other}
      />
    </DropdownSubmenuContext.Provider>
  );
};
