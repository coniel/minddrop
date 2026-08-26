import React, { useCallback, useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { DatabaseEntries } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { CollectionSelectionSubmenu } from '@minddrop/ui-components';
import { DatabaseEntryRenderSource } from '@minddrop/ui-databases';
import { ActionMenuItem, DropdownMenuSeparator } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import {
  CloseDatabaseEntryDialogEvent,
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
} from '../events';

export interface DatabaseEntryOptionsMenuProps {
  /**
   * The ID of the database entry.
   */
  entryId: string;

  /**
   * The source the entry is rendered from. Enables source
   * specific options, e.g. remove from collection when rendered
   * from a collection.
   */
  source?: DatabaseEntryRenderSource;
}

/**
 * Renders the menu items for a database entry options menu.
 * Designed to be used as children of a DropdownMenu or ContextMenu.
 */
export const DatabaseEntryOptionsMenu: React.FC<
  DatabaseEntryOptionsMenuProps
> = ({ entryId, source }) => {
  const allCollections = Collections.useAll();
  const openView = Views.useOpenView();

  // The collection the entry is rendered from, when rendered
  // from a collection
  const collectionId = source?.type === 'collection' ? source.id : undefined;

  // Collections the entry can be added to: persisted collections
  // which do not already contain the entry
  const availableCollections = useMemo(
    () =>
      allCollections.filter(
        (collection) =>
          !collection.virtual && !collection.items.includes(entryId),
      ),
    [allCollections, entryId],
  );

  // Whether any collection controls are rendered
  const showCollectionControls =
    availableCollections.length > 0 || Boolean(collectionId);

  // Navigate to the entry's parent database
  const handleGoToDatabase = useCallback(() => {
    const entry = DatabaseEntries.get(entryId);

    if (!entry) {
      return;
    }

    // Close the entry dialog if open
    Events.dispatch(CloseDatabaseEntryDialogEvent);

    openView<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
      databaseId: entry.database,
    });
  }, [entryId, openView]);

  // Duplicate the entry
  const handleDuplicate = useCallback(() => {
    DatabaseEntries.duplicate(entryId, source);
  }, [entryId, source]);

  // Delete the entry
  const handleDelete = useCallback(() => {
    // Close the entry dialog if open
    Events.dispatch(CloseDatabaseEntryDialogEvent);

    // Delete the entry, moving its files to the system trash
    DatabaseEntries.delete(entryId);
  }, [entryId]);

  // Add the entry to the selected collection
  const handleAddToCollection = useCallback(
    (targetCollectionId: string) => {
      Collections.addItems(targetCollectionId, [entryId]);
    },
    [entryId],
  );

  // Remove the entry from the current collection
  const handleRemoveFromCollection = useCallback(() => {
    if (!collectionId) {
      return;
    }

    Collections.removeItems(collectionId, [entryId]);
  }, [collectionId, entryId]);

  return (
    <>
      {/* Navigate to the parent database, unless already rendered
          from it */}
      {source?.type !== 'database' && (
        <ActionMenuItem
          icon="database"
          label="databases.entries.actions.goToDatabase"
          onSelect={handleGoToDatabase}
        />
      )}

      {/* Duplicate the entry */}
      <ActionMenuItem
        icon="copy"
        label="actions.duplicate"
        onSelect={handleDuplicate}
      />

      {/* Collection controls, separated from the entry actions */}
      {showCollectionControls && (
        <>
          <DropdownMenuSeparator />

          {/* Add the entry to a collection */}
          {availableCollections.length > 0 && (
            <CollectionSelectionSubmenu
              collections={availableCollections}
              onSelect={handleAddToCollection}
            />
          )}

          {/* Remove the entry from the current collection */}
          {collectionId && (
            <ActionMenuItem
              icon="circle-minus"
              label="databases.entries.actions.removeFromCollection"
              onSelect={handleRemoveFromCollection}
            />
          )}

          <DropdownMenuSeparator />
        </>
      )}

      {/* Delete the entry */}
      <ActionMenuItem
        danger
        icon="trash"
        label="actions.delete"
        onSelect={handleDelete}
      />
    </>
  );
};
