import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { MenuLabel } from '../Menu/MenuLabel';

/* --- DropdownMenuLabel ---
   Section heading inside a dropdown menu group.
   Accepts a translatable `label` string or arbitrary children. */

export interface DropdownMenuLabelProps
  extends Omit<MenuPrimitive.GroupLabel.Props, 'children'> {
  children?: React.ReactNode;
  /*
   * Label string. Can be an i18n key. Translated internally.
   * Use children for non-string content.
   */
  label?: string;
}

export const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  children,
  label,
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <MenuPrimitive.GroupLabel {...other}>
      <MenuLabel>{label ? t(label) : children}</MenuLabel>
    </MenuPrimitive.GroupLabel>
  );
};
