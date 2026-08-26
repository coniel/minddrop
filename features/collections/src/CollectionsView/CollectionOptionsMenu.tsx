import React from 'react';
import { Collection, Collections } from '@minddrop/collections';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  IconButton,
} from '@minddrop/ui-primitives';

export interface CollectionOptionsMenuProps {
  /**
   * The collection for which to render the options menu.
   */
  collection: Collection;
}

/**
 * Renders a dropdown menu button containing a collection's actions.
 */
export const CollectionOptionsMenu: React.FC<CollectionOptionsMenuProps> = ({
  collection,
}) => {
  // Confirm before deleting the collection
  function handleDelete() {
    Events.dispatch(OpenConfirmationDialogEvent, {
      title: 'collections.actions.delete.confirmation.title',
      message: 'collections.actions.delete.confirmation.message',
      confirmLabel: 'collections.actions.delete.confirmation.confirm',
      onConfirm: () => Collections.delete(collection.id),
    });
  }

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <IconButton
          icon="ellipsis"
          size="lg"
          variant="subtle"
          color="neutral"
          label="collections.actions.options"
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="end">
          <DropdownMenuContent>
            <DropdownMenuItem
              danger
              icon="trash-2"
              label="collections.actions.delete.label"
              onSelect={handleDelete}
            />
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};
