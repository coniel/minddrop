import React, { FC } from 'react';
import { DropMenu, DropMenuProps } from '../DropMenu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@minddrop/ui';
import { useSelectableDrop } from '@minddrop/app';

export interface DropContextMenuProps extends Omit<DropMenuProps, 'menuType'> {
  /**
   * The ID of the drop.
   */
  dropId: string;

  /**
   * The ID of the parent topic.
   */
  topicId: string;
}

export const DropContextMenu: FC<DropContextMenuProps> = ({
  children,
  dropId,
  ...other
}) => {
  const { isSelected, selectAsOnly } = useSelectableDrop(dropId);

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (!isSelected && open) {
          // If the drop is not selected, and the menu
          // is being opened, select the drop as the
          // only selected drop.
          selectAsOnly();
        }
      }}
    >
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="drop-menu-content">
        <DropMenu menuType="context" dropId={dropId} {...other} />
      </ContextMenuContent>
    </ContextMenu>
  );
};
