import React, { FC, useMemo, useState } from 'react';
import { mapPropsToClasses, useToggle } from '@minddrop/utils';
import { i18n } from '@minddrop/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverPortal,
  Toolbar,
} from '@minddrop/ui-elements';
import { createBlockOptionsMenu } from '../../menus/createBlockOptionsMenu';
import './BlockOptionsMenu.css';
import { ContentPicker } from '../ContentPicker';
import { Documents } from '@minddrop/documents';

export interface BlockOptionsMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The ID of the block.
   */
  blockId: string;

  /**
   * Additional actions. Should be IconButtons.
   */
  children?: React.ReactNode;
}

export const BlockOptionsMenu: FC<BlockOptionsMenuProps> = ({
  blockId,
  children,
  className,
  ...other
}) => {
  const [visible, setVisible] = useState(false);
  const [movePopoverOpen, toggleMovePopoverOpen] = useToggle(false);

  const dropdownMenuContent = useMemo(
    () =>
      createBlockOptionsMenu(blockId, { onSelectMove: toggleMovePopoverOpen }),
    [blockId, toggleMovePopoverOpen],
  );

  const move = (toDocumentId: string) => {
    // Move the blocks
    Documents.moveBlocks(toDocumentId, [blockId]);

    toggleMovePopoverOpen();
  };

  return (
    <Popover open={movePopoverOpen}>
      <PopoverAnchor asChild>
        <div
          className={mapPropsToClasses(
            { className, visible },
            'block-options-menu',
          )}
          {...other}
        >
          <Toolbar>
            {children}

            <DropdownMenu
              onOpenChange={(open) => {
                setVisible(open);
              }}
            >
              <DropdownMenuTrigger asChild>
                <IconButton
                  icon="more-vertical"
                  label={i18n.t('blockOptions')}
                />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  className="block-options-menu-content"
                  align="end"
                  minWidth={220}
                  content={dropdownMenuContent}
                />
              </DropdownMenuPortal>
            </DropdownMenu>
          </Toolbar>
        </div>
      </PopoverAnchor>
      <PopoverPortal>
        <ContentPicker
          side="bottom"
          align="end"
          pickable="document"
          onSelect={move}
          onClose={toggleMovePopoverOpen}
        />
      </PopoverPortal>
    </Popover>
  );
};
