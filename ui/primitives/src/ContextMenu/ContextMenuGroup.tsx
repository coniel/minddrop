import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { FC } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { ContextMenuLabel } from './ContextMenuLabel';

/* --- ContextMenuGroup ---
   Wraps items in a ContextMenu.Group with an optional label above. */

export interface ContextMenuGroupProps
  extends ContextMenuPrimitive.Group.Props {
  /*
   * Group label. Can be an i18n key. Translated internally.
   */
  label?: TranslationKey;
}

export const ContextMenuGroup: FC<ContextMenuGroupProps> = ({
  label,
  children,
  ...other
}) => (
  <ContextMenuPrimitive.Group {...other}>
    {label && <ContextMenuLabel label={label} />}
    {children}
  </ContextMenuPrimitive.Group>
);
