import { FC, useCallback, useMemo, useState } from 'react';
import {
  Database,
  DatabaseEntries,
  DatabaseEntry,
  DatabaseEntryTemplate,
  Databases,
} from '@minddrop/databases';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownSearchableMenuItem,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
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
 * create the entry in. Databases with entry templates list a blank
 * entry option followed by their templates.
 */
export const CreateDatabaseEntryButton: FC<CreateDatabaseEntryButtonProps> = ({
  database,
  onCreateEntry,
  ...rest
}) => {
  const [query, setQuery] = useState('');
  const allDatabases = Databases.useAll();

  // Database IDs to include, undefined when all are supported
  const databaseIds = useMemo(() => {
    // When false, all databases are supported
    if (database === false) {
      return undefined;
    }

    return Array.isArray(database) ? database : [database];
  }, [database]);

  // Resolve the list of databases to show
  const databases = useMemo(() => {
    // Without a set of IDs, use all databases
    if (!databaseIds) {
      return allDatabases;
    }

    // Resolve the databases from the IDs
    return databaseIds.map((id) => Databases.get(id)).filter(Boolean);
  }, [databaseIds, allDatabases]);

  // Databases listed in the menu, fuzzy matched while searching
  const listedDatabases = query
    ? Databases.search(query, databaseIds)
    : databases;

  // Templates matched by name while searching. Templates of a
  // matched database are already listed under it, so only templates
  // from other databases are added.
  const matchedTemplates = query
    ? Databases.searchEntryTemplates(query, databaseIds).filter(
        (result) => !listedDatabases.some((db) => db.id === result.database.id),
      )
    : [];

  // Reset the search query when the menu opens
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setQuery('');
    }
  }, []);

  // Creates an entry in the given database, optionally from a
  // template, and forwards it to the callback
  const handleCreate = useCallback(
    async (databaseId: string, templateId?: string) => {
      // Create from the template when one is selected
      const entry = templateId
        ? await DatabaseEntries.createFromTemplate(databaseId, templateId)
        : await DatabaseEntries.create(databaseId);

      onCreateEntry(entry);
    },
    [onCreateEntry],
  );

  // Single database mode
  if (database !== false && databases.length <= 1) {
    const singleDatabase = databases[0];
    const templates = singleDatabase?.entryTemplates ?? [];

    // Without templates, render a plain button
    if (!templates.length) {
      return (
        <IconButton
          icon="plus"
          label="databases.entries.actions.create"
          onClick={() => handleCreate(singleDatabase.id)}
          {...rest}
        />
      );
    }

    // With templates, render a menu with a blank entry option
    // followed by the templates
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
        <DropdownMenuItem
          label="databases.entryTemplates.menus.blankEntry"
          contentIcon={singleDatabase.icon}
          onSelect={() => handleCreate(singleDatabase.id)}
        />
        {templates.map((template) => (
          <DropdownMenuItem
            key={template.id}
            stringLabel={template.name}
            contentIcon={singleDatabase.icon}
            onSelect={() => handleCreate(singleDatabase.id, template.id)}
          />
        ))}
      </DropdownMenu>
    );
  }

  // Render a database's create option. Databases with entry
  // templates nest their options in a submenu, with the blank entry
  // option first.
  function renderDatabaseItem(db: Database) {
    const templates = db.entryTemplates ?? [];

    // Databases without templates create an entry directly
    if (!templates.length) {
      return (
        <DropdownSearchableMenuItem
          key={db.id}
          stringLabel={db.name}
          contentIcon={db.icon}
          onSelect={() => handleCreate(db.id)}
        />
      );
    }

    return (
      <DropdownSubmenu key={db.id}>
        <DropdownSubmenuTriggerItem
          stringLabel={db.name}
          contentIcon={db.icon}
        />
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
            <DropdownSubmenuContent>
              <DropdownSearchableMenuItem
                label="databases.entryTemplates.menus.blankEntry"
                contentIcon={db.icon}
                onSelect={() => handleCreate(db.id)}
              />
              {templates.map((template) => (
                <DropdownSearchableMenuItem
                  key={template.id}
                  stringLabel={template.name}
                  contentIcon={db.icon}
                  onSelect={() => handleCreate(db.id, template.id)}
                />
              ))}
            </DropdownSubmenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownSubmenu>
    );
  }

  // Render a database's create options as flat items. Used while
  // searching, where submenus are collapsed into the results list.
  function renderFlatDatabaseItems(db: Database) {
    return [
      <DropdownSearchableMenuItem
        key={db.id}
        stringLabel={db.name}
        contentIcon={db.icon}
        onSelect={() => handleCreate(db.id)}
      />,
      ...(db.entryTemplates ?? []).map((template) =>
        renderFlatTemplateItem(db, template),
      ),
    ];
  }

  // Render a template's create option as a flat item, qualified by
  // database name to stay distinguishable in a flat list
  function renderFlatTemplateItem(
    db: Database,
    template: DatabaseEntryTemplate,
  ) {
    return (
      <DropdownSearchableMenuItem
        key={`${db.id}:${template.id}`}
        stringLabel={`${db.name} · ${template.name}`}
        contentIcon={db.icon}
        onSelect={() => handleCreate(db.id, template.id)}
      />
    );
  }

  // Multiple databases: render a searchable dropdown menu
  return (
    <DropdownMenu
      searchable
      searchTerm={query}
      onSearchTermChange={setQuery}
      searchPlaceholder="databases.labels.databases"
      onOpenChange={handleOpenChange}
      trigger={
        <IconButton
          icon="plus"
          label="databases.entries.actions.create"
          {...rest}
        />
      }
    >
      {listedDatabases.map((db) =>
        query ? renderFlatDatabaseItems(db) : renderDatabaseItem(db),
      )}
      {matchedTemplates.map((result) =>
        renderFlatTemplateItem(result.database, result.template),
      )}
    </DropdownMenu>
  );
};
