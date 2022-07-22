import React, { FC, useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  Toolbar,
  Tooltip,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  IconButton,
  DropdownMenuTopicSelectionItem,
} from '@minddrop/ui';
import { Drops } from '@minddrop/drops';
import { Topics } from '@minddrop/topics';
import { useAppCore, App } from '@minddrop/app';
import { TopicSelectionMenu } from '../TopicSelectionMenu';

export interface DropTrashActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The ID of the drop.
   */
  dropId: string;

  /**
   * Callback fired when a dropdown's open
   * state changes.
   */
  onDropdownOpenChange?(open: boolean): void;
}

export const DropTrashActions: FC<DropTrashActionsProps> = ({
  dropId,
  onDropdownOpenChange,
  ...other
}) => {
  const core = useAppCore();
  const { t } = useTranslation();
  // const { isSelected, selectAsOnly } = useSelectableDrop(dropId);

  const handleDeletePermanently = useCallback(() => {
    if (!App.getSelectedDrops()[dropId]) {
      // If the drop is not selected, exclusively select
      // it in order to only delete this drop.
      App.clearSelection(core);
      App.selectDrops(core, [dropId]);
    }

    // Get selected drops
    const selectedDrops = App.getSelectedDrops();

    // Permanently delete selected drops
    Object.values(selectedDrops).forEach((drop) => {
      Drops.deletePermanently(core, drop.id);
    });

    // Clear selection
    App.clearSelection(core);
  }, [core, dropId]);

  const handleRestore = useCallback(
    (event: Event, topicId) => {
      if (!App.getSelectedDrops()[dropId]) {
        // If the drop is not selected, exclusively select
        // it in order to only delete this drop.
        App.clearSelection(core);
        App.selectDrops(core, [dropId]);
      }

      // Get selected drop IDs
      const selectedDrops = Object.keys(App.getSelectedDrops());

      // Restore selected drops
      selectedDrops.forEach((dropId) => {
        Drops.restore(core, dropId);
      });

      // Add the drop to the selected topic
      Topics.addDrops(core, topicId, selectedDrops);

      // Clear selection
      App.clearSelection(core);
    },
    [core, dropId],
  );

  return (
    <div className="drop-trash-actions" {...other}>
      <Toolbar>
        <Tooltip title={t('deletePermanently')}>
          <IconButton
            icon="trash"
            label={t('deletePermanently')}
            onClick={handleDeletePermanently}
          />
        </Tooltip>
        <DropdownMenu onOpenChange={onDropdownOpenChange}>
          <DropdownMenuTrigger asChild>
            <IconButton icon="undo" label={t('restore')} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="drop-menu-content">
            <TopicSelectionMenu
              MenuItemComponent={DropdownMenuTopicSelectionItem}
              onSelect={handleRestore}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </Toolbar>
    </div>
  );
};
