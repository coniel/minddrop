import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React, { FC } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { MenuLabel } from '../Menu/MenuLabel';

/* --- ComboboxGroupLabel ---
   Section heading inside a combobox group.
   Accepts a translatable `label` string or arbitrary children. */

export interface ComboboxGroupLabelProps
  extends Omit<ComboboxPrimitive.GroupLabel.Props, 'children'> {
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

export const ComboboxGroupLabel: FC<ComboboxGroupLabelProps> = ({
  children,
  label,
  stringLabel,
  ...other
}) => {
  return (
    <ComboboxPrimitive.GroupLabel
      {...other}
      render={
        <MenuLabel label={label} stringLabel={stringLabel}>
          {children}
        </MenuLabel>
      }
    />
  );
};
