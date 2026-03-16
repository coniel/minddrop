import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React, { FC } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { MenuLabel } from '../Menu/MenuLabel';

/* --- ContextMenuLabel ---
   Section heading inside a context menu group.
   Accepts a translatable `label` string or arbitrary children. */

export interface ContextMenuLabelProps
  extends Omit<ContextMenuPrimitive.GroupLabel.Props, 'children'> {
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

export const ContextMenuLabel: FC<ContextMenuLabelProps> = ({
  children,
  label,
  stringLabel,
  ...other
}) => {
  return (
    <ContextMenuPrimitive.GroupLabel
      {...other}
      render={
        <MenuLabel label={label} stringLabel={stringLabel}>
          {children}
        </MenuLabel>
      }
    />
  );
};
