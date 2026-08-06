import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { DropdownMenuLabel } from './DropdownMenuLabel';

/* --- DropdownMenuGroup ---
   Wraps items in a Menu.Group with an optional label above. */

export interface DropdownMenuGroupProps extends MenuPrimitive.Group.Props {
  /*
   * Group label. Can be an i18n key. Translated internally.
   */
  label?: TranslationKey;

  /*
   * Plain string group label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;
}

export const DropdownMenuGroup: FC<DropdownMenuGroupProps> = ({
  label,
  stringLabel,
  children,
  ...other
}) => (
  <MenuPrimitive.Group {...other}>
    {(label || stringLabel) && (
      <DropdownMenuLabel label={label} stringLabel={stringLabel} />
    )}
    {children}
  </MenuPrimitive.Group>
);
