import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { FC } from 'react';
import { IconProp } from '../IconRenderer';
import { MenuItem } from '../Menu/MenuItem';

/* --- ContextSubmenuTriggerItem ---
   The trigger item that opens a nested submenu. */

export interface ContextSubmenuTriggerItemProps
  extends Omit<
    ContextMenuPrimitive.SubmenuTrigger.Props,
    'children' | 'label'
  > {
  label?: string;
  icon?: IconProp;
  disabled?: boolean;
}

export const ContextSubmenuTriggerItem: FC<ContextSubmenuTriggerItemProps> = ({
  label,
  icon,
  disabled,
  ...other
}) => (
  <ContextMenuPrimitive.SubmenuTrigger
    render={
      <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
    }
    disabled={disabled}
    {...other}
  />
);
