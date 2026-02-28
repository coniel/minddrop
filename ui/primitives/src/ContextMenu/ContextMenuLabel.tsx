import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React, { FC } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { MenuLabel } from '../Menu/MenuLabel';

/* --- ContextMenuLabel ---
   Section heading inside a context menu group.
   Accepts a translatable `label` string or arbitrary children. */

export interface ContextMenuLabelProps
  extends Omit<ContextMenuPrimitive.GroupLabel.Props, 'children'> {
  children?: React.ReactNode;
  /*
   * Label string. Can be an i18n key. Translated internally.
   * Use children for non-string content.
   */
  label?: string;
}

export const ContextMenuLabel: FC<ContextMenuLabelProps> = ({
  children,
  label,
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <ContextMenuPrimitive.GroupLabel {...other}>
      <MenuLabel>{label ? t(label) : children}</MenuLabel>
    </ContextMenuPrimitive.GroupLabel>
  );
};
