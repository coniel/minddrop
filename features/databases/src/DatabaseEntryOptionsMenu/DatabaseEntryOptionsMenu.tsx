import React, { useCallback } from 'react';
import { DatabaseEntries } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { ActionMenuItem } from '@minddrop/ui-primitives';
import { OpenDatabaseViewEvent, OpenDatabaseViewEventData } from '../events';

export interface DatabaseEntryOptionsMenuProps {
  /**
   * The ID of the database entry.
   */
  entryId: string;
}

/**
 * Renders the menu items for a database entry options menu.
 * Designed to be used as children of a DropdownMenu or ContextMenu.
 */
export const DatabaseEntryOptionsMenu: React.FC<
  DatabaseEntryOptionsMenuProps
> = ({ entryId }) => {
  // Navigate to the entry's parent database
  const handleGoToDatabase = useCallback(() => {
    const entry = DatabaseEntries.get(entryId);

    if (!entry) {
      return;
    }

    Events.dispatch<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
      databaseId: entry.database,
    });
  }, [entryId]);

  // Duplicate the entry
  const handleDuplicate = useCallback(() => {
    // TODO: implement when DatabaseEntries.duplicate is available
  }, [entryId]);

  // Delete the entry
  const handleDelete = useCallback(() => {
    // TODO: implement when DatabaseEntries.delete is available
  }, [entryId]);

  return (
    <>
      {/* Navigate to the parent database */}
      <ActionMenuItem
        icon="database"
        label="databases.entries.actions.goToDatabase"
        onClick={handleGoToDatabase}
      />

      {/* Duplicate the entry */}
      <ActionMenuItem
        icon="copy"
        label="actions.duplicate"
        onClick={handleDuplicate}
      />

      {/* Delete the entry */}
      <ActionMenuItem
        danger
        icon="trash"
        label="actions.delete"
        onClick={handleDelete}
      />
    </>
  );
};
