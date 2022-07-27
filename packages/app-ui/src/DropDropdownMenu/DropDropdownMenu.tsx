import React, { FC } from 'react';
import { DropMenu, DropMenuProps } from '../DropMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  IconButton,
} from '@minddrop/ui';
import { useSelectable } from '@minddrop/selection';
import { i18n } from '@minddrop/i18n';

export interface DropDropdownMenuProps extends Omit<DropMenuProps, 'menuType'> {
  /**
   * The ID of the drop.
   */
  dropId: string;

  /**
   * The ID of the parent topic.
   */
  topicId: string;

  /**
   * Callback fired when the open state of the
   * menu changes.
   */
  onOpenChange?: (open: boolean) => void;
}

export const DropDropdownMenu: FC<DropDropdownMenuProps> = ({
  dropId,
  onOpenChange,
  ...other
}) => {
  const { selected, select } = useSelectable({
    resource: 'drops:drop',
    id: dropId,
  });

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!selected && open) {
          // If the drop is not selected, and the menu
          // is being opened, select the drop as the
          // only selected drop.
          select();
        }

        if (onOpenChange) {
          // Call the onOpenChange callback if provided
          onOpenChange(open);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <IconButton icon="more-vertical" label={i18n.t('dropOptions')} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="drop-menu-content">
        <DropMenu menuType="dropdown" dropId={dropId} {...other} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
