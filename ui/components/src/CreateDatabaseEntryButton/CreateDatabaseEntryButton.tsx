import { FC, useCallback, useMemo } from 'react';
import {
  Database,
  DatabaseEntries,
  DatabaseEntry,
  Databases,
} from '@minddrop/databases';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  IconButtonProps,
} from '@minddrop/ui-primitives';

export interface CreateDatabaseEntryButtonProps
  extends Omit<IconButtonProps, 'icon' | 'label' | 'stringLabel'> {
  /**
   * Database ID, array of database IDs, or `false`.
   * When `false`, a searchable dropdown of all databases
   * is rendered.
   */
  database: string | string[] | false;

  /**
   * Called with the newly created entry after it
   * has been persisted.
   */
  onCreateEntry: (entry: DatabaseEntry) => void;
}

/**
 * Renders an icon button that creates a new database entry.
 * When multiple databases are provided or `database` is `false`,
 * opens a searchable dropdown menu to pick which database to
 * create the entry in.
 */
export const CreateDatabaseEntryButton: FC<CreateDatabaseEntryButtonProps> = ({
  database,
  onCreateEntry,
  ...rest
}) => {
  // When false, use all databases
  const allDatabases = Databases.useAll();

  // Resolve the list of databases to show
  const databases = useMemo(() => {
    if (database === false) {
      return allDatabases;
    }

    const ids = Array.isArray(database) ? database : [database];

    return ids.map((id) => Databases.get(id)).filter(Boolean) as Database[];
  }, [database, allDatabases]);

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
  if (database !== false && databases.length <= 1) {
    return (
      <IconButton
        icon="plus"
        label="databases.entries.actions.create"
        onClick={() => handleCreate(databases[0].id)}
        {...rest}
      />
    );
  }

  // Multiple databases or all databases: render a searchable
  // dropdown menu
  return (
    <DropdownMenu
      searchable
      searchPlaceholder="databases.labels.databases"
      trigger={
        <IconButton
          icon="plus"
          label="databases.entries.actions.create"
          {...rest}
        />
      }
    >
      {databases.map((db) => (
        <DropdownMenuItem
          key={db.id}
          label={<>{db.name}</>}
          textValue={db.name}
          contentIcon={db.icon}
          onSelect={() => handleCreate(db.id)}
        />
      ))}
    </DropdownMenu>
  );
};
