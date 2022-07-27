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
import { Selection } from '@minddrop/selection';
import { useAppCore } from '@minddrop/app';
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
    if (!Selection.getIds().includes(dropId)) {
      // If the drop is not selected, exclusively select
      // it in order to only delete this drop.
      Selection.select(core, [{ resource: 'drops:drop', id: dropId }]);
    }

    // Get selected drop IDs
    const selectedDrops = Selection.getIds('drops:drop');

    // Permanently delete selected drops
    selectedDrops.forEach((dropId) => {
      Drops.deletePermanently(core, dropId);
    });

    // Clear selection
    Selection.clear(core);
  }, [core, dropId]);

  const handleRestore = useCallback(
    (event: Event, topicId) => {
      if (!Selection.getIds().includes(dropId)) {
        // If the drop is not selected, exclusively select
        // it in order to only delete this drop.
        Selection.select(core, [{ resource: 'drops:drop', id: dropId }]);
      }

      // Get selected drop IDs
      const selectedDrops = Selection.getIds('drops:drop');

      // Restore selected drops
      selectedDrops.forEach((dropId) => {
        Drops.restore(core, dropId);
      });

      // Add the drop to the selected topic
      Topics.addDrops(core, topicId, selectedDrops);

      // Clear selection
      Selection.clear(core);
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
