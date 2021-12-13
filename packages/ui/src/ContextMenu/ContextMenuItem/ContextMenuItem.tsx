import React, { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { Tooltip } from '../../Tooltip';
import { MenuItem } from '../../Menu';
import { MenuItemProps } from '../../types';

export interface ContextMenuItemProps
  extends Omit<
      ContextMenuPrimitives.ContextMenuItemProps,
      'children' | 'onSelect'
    >,
    MenuItemProps {}

export const ContextMenuItem: FC<ContextMenuItemProps> = ({
  label,
  icon,
  keyboardShortcut,
  tooltipTitle,
  tooltipDescription,
  disabled,
  ...other
}) => {
  const item = (
    <ContextMenuPrimitives.Item asChild disabled={disabled} {...other}>
      <MenuItem
        label={label}
        icon={icon}
        keyboardShortcut={keyboardShortcut}
        disabled={disabled}
      />
    </ContextMenuPrimitives.Item>
  );

  if (tooltipTitle) {
    return (
      <Tooltip
        side="right"
        sideOffset={6}
        skipDelayDuration={0}
        delayDuration={800}
        title={tooltipTitle}
        description={tooltipDescription}
      >
        {item}
      </Tooltip>
    );
  }

  return item;
};
