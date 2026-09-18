import { FC } from 'react';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  IconButton,
  IconButtonProps,
} from '@minddrop/ui-primitives';
import { AddContentMenu, AddContentMenuProps } from './AddContentMenu';

export interface AddContentButtonProps
  extends Omit<IconButtonProps, 'icon' | 'label' | 'stringLabel'>,
    Pick<AddContentMenuProps, 'suggested' | 'excludeIds' | 'limit' | 'onAdd'> {
  /**
   * Minimum width of the menu popup.
   *
   * @default 300
   */
  popupWidth?: number;
}

/**
 * Renders an icon button which opens the add content menu.
 */
export const AddContentButton: FC<AddContentButtonProps> = ({
  suggested,
  excludeIds,
  limit,
  onAdd,
  popupWidth = 300,
  ...rest
}) => (
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton icon="plus" label="addContent.actions.add" {...rest} />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuPositioner side="bottom" align="start" sideOffset={4}>
        {/** Render the add content menu as the popup itself **/}
        <DropdownMenuContent
          render={
            <AddContentMenu
              scrollable
              style={{ minWidth: popupWidth }}
              suggested={suggested}
              excludeIds={excludeIds}
              limit={limit}
              onAdd={onAdd}
            />
          }
        />
      </DropdownMenuPositioner>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
);
