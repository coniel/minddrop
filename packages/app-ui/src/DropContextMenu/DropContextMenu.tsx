import React, { FC } from 'react';
import { DropMenu, DropMenuProps } from '../menus/DropMenu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@minddrop/ui';
import { App, useAppCore, useSelectableDrop } from '@minddrop/app';

export interface DropContextMenuProps extends Omit<DropMenuProps, 'menuType'> {
  /**
   * The ID of the drop.
   */
  drop: string;

  /**
   * The ID of the parent topic.
   */
  topic: string;
}

export const DropContextMenu: FC<DropContextMenuProps> = ({
  children,
  drop,
  ...other
}) => {
  const core = useAppCore();
  const { isSelected, select } = useSelectableDrop(drop);

  return (
    <ContextMenu
      onOpenChange={() => {
        if (!isSelected) {
          App.clearSelectedDrops(core);
          select();
        }
      }}
    >
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="drop-menu-content">
        <DropMenu menuType="context" drop={drop} {...other} />
      </ContextMenuContent>
    </ContextMenu>
  );
};
