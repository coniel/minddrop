import React, { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { MenuItem } from '../Menu';
import { MenuTriggerItemProps } from '../types';

export interface ContextMenuTriggerItemProps
  extends Omit<ContextMenuPrimitives.ContextMenuTriggerItemProps, 'children'>,
    Omit<MenuTriggerItemProps, 'onSelect'> {}

export const ContextMenuTriggerItem: FC<ContextMenuTriggerItemProps> = ({
  label,
  icon,
  disabled,
  ...other
}) => {
  return (
    <ContextMenuPrimitives.TriggerItem asChild disabled={disabled} {...other}>
      <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
    </ContextMenuPrimitives.TriggerItem>
  );
};
