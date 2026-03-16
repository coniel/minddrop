import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { MenuLabel } from '../Menu/MenuLabel';

/* --- DropdownMenuLabel ---
   Section heading inside a dropdown menu group.
   Accepts a translatable `label` string or arbitrary children. */

export interface DropdownMenuLabelProps
  extends Omit<MenuPrimitive.GroupLabel.Props, 'children'> {
  /*
   * Arbitrary content rendered when neither `stringLabel`
   * nor `label` is provided.
   */
  children?: React.ReactNode;

  /*
   * i18n key for the label text. Translated internally.
   * Use children for non-string content.
   */
  label?: TranslationKey;

  /*
   * Plain string label rendered without i18n translation.
   * Takes priority over `label` and `children`.
   */
  stringLabel?: string;
}

export const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  children,
  label,
  stringLabel,
  ...other
}) => {
  return (
    <MenuPrimitive.GroupLabel
      {...other}
      render={
        <MenuLabel label={label} stringLabel={stringLabel}>
          {children}
        </MenuLabel>
      }
    />
  );
};
