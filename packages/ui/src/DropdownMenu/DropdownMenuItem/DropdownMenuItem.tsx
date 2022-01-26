import React, { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { Tooltip } from '../../Tooltip';
import { MenuItem } from '../../Menu';
import { TooltipMenuItemProps } from '../../types';

export interface DropdownMenuItemProps
  extends Omit<
      DropdownMenuPrimitives.DropdownMenuItemProps,
      'children' | 'onSelect'
    >,
    TooltipMenuItemProps {}

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  label,
  icon,
  keyboardShortcut,
  tooltipTitle,
  tooltipDescription,
  disabled,
  ...other
}) => {
  const item = (
    <DropdownMenuPrimitives.Item asChild disabled={disabled} {...other}>
      <MenuItem
        label={label}
        icon={icon}
        keyboardShortcut={keyboardShortcut}
        disabled={disabled}
      />
    </DropdownMenuPrimitives.Item>
  );

  if (tooltipTitle) {
    return (
      <Tooltip
        side="right"
        sideOffset={6}
        skipDelayDuration={0}
        title={tooltipTitle}
        description={tooltipDescription}
      >
        {item}
      </Tooltip>
    );
  }

  return item;
};
