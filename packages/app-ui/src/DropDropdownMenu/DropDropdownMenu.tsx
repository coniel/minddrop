import React, { FC } from 'react';
import { DropMenu, DropMenuProps } from '../menus';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  IconButton,
} from '@minddrop/ui';
import { useSelectableDrop } from '@minddrop/app';
import { i18n } from '@minddrop/i18n';

export interface DropDropdownMenuProps extends Omit<DropMenuProps, 'menuType'> {
  /**
   * The ID of the drop.
   */
  drop: string;

  /**
   * The ID of the parent topic.
   */
  topic: string;
}

export const DropDropdownMenu: FC<DropDropdownMenuProps> = ({
  drop,
  ...other
}) => {
  const { isSelected, selectAsOnly } = useSelectableDrop(drop);

  return (
    <DropdownMenu
      onOpenChange={() => {
        if (!isSelected) {
          selectAsOnly();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <IconButton icon="more-vertical" label={i18n.t('dropOptions')} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="drop-menu-content">
        <DropMenu menuType="dropdown" drop={drop} {...other} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
