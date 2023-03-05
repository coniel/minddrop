import { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { MenuItem } from '../Menu';
import { SubmenuTriggerItemProps } from '../types';

export interface ContextSubmenuTriggerItemProps
  extends Omit<ContextMenuPrimitives.ContextMenuSubTriggerProps, 'children'>,
    Omit<SubmenuTriggerItemProps, 'onSelect'> {}

export const ContextSubmenuTriggerItem: FC<ContextSubmenuTriggerItemProps> = ({
  label,
  icon,
  disabled,
  ...other
}) => (
  <ContextMenuPrimitives.SubTrigger asChild disabled={disabled} {...other}>
    <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
  </ContextMenuPrimitives.SubTrigger>
);
