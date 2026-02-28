import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC } from 'react';
import { DropdownMenuLabel } from './DropdownMenuLabel';

/* --- DropdownMenuGroup ---
   Wraps items in a Menu.Group with an optional label above. */

export interface DropdownMenuGroupProps extends MenuPrimitive.Group.Props {
  /*
   * Group label. Can be an i18n key. Translated internally.
   */
  label?: string;
}

export const DropdownMenuGroup: FC<DropdownMenuGroupProps> = ({
  label,
  children,
  ...other
}) => (
  <MenuPrimitive.Group {...other}>
    {label && <DropdownMenuLabel label={label} />}
    {children}
  </MenuPrimitive.Group>
);
