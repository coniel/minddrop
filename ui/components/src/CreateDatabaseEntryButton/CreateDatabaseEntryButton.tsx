import { FC, useCallback, useMemo } from 'react';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  IconButtonProps,
} from '@minddrop/ui-primitives';

export interface CreateDatabaseEntryButtonProps
  extends Omit<IconButtonProps, 'icon' | 'label'> {
  /**
   * Database ID or array of database IDs in which
   * new entries can be created.
   */
  database: string | string[];

  /**
   * Called with the newly created entry after it
   * has been persisted.
   */
  onCreateEntry: (entry: DatabaseEntry) => void;
}

/**
 * Renders an icon button that creates a new database entry.
 * When multiple databases are provided, opens a dropdown
 * menu to pick which database to create the entry in.
 */
export const CreateDatabaseEntryButton: FC<CreateDatabaseEntryButtonProps> = ({
  database,
  onCreateEntry,
  ...rest
}) => {
  // Normalise the database prop to an array
  const databaseIds = useMemo(
    () => (Array.isArray(database) ? database : [database]),
    [database],
  );

  // Creates an entry in the given database and
  // forwards it to the callback
  const handleCreate = useCallback(
    async (databaseId: string) => {
      const entry = await DatabaseEntries.create(databaseId);

      onCreateEntry(entry);
    },
    [onCreateEntry],
  );

  // Single database: render a plain button
  if (databaseIds.length <= 1) {
    return (
      <IconButton
        icon="plus"
        label="databases.entries.actions.create"
        onClick={() => handleCreate(databaseIds[0])}
        {...rest}
      />
    );
  }

  // Multiple databases: render a dropdown menu
  return (
    <DropdownMenu
      trigger={
        <IconButton
          icon="plus"
          label="databases.entries.actions.create"
          {...rest}
        />
      }
    >
      {databaseIds.map((id) => {
        const db = Databases.get(id);

        return (
          <DropdownMenuItem
            key={id}
            label={<>{db.name}</>}
            contentIcon={db.icon}
            onClick={() => handleCreate(id)}
          />
        );
      })}
    </DropdownMenu>
  );
};
