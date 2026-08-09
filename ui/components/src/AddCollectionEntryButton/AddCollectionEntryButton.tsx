import { FC, useCallback, useState } from 'react';
import { Collections } from '@minddrop/collections';
import {
  Database,
  DatabaseEntries,
  DatabaseEntry,
  DatabaseEntryTemplate,
  Databases,
} from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownSearchableMenuItem,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
  IconButton,
  IconButtonProps,
} from '@minddrop/ui-primitives';
import { DATABASE_FALLBACK_ICON } from '../constants';

// Maximum number of entries listed when not searching
const DEFAULT_ENTRIES_LIMIT = 10;

// Maximum number of matched entries listed when searching
const SEARCH_ENTRIES_LIMIT = 15;

export interface AddCollectionEntryButtonProps
  extends Omit<IconButtonProps, 'icon' | 'label' | 'stringLabel'> {
  /**
   * The ID of the collection entries are added to.
   */
  collectionId: string;

  /**
   * Database ID, array of database IDs, or `false`. Limits which
   * databases entries can be created in or selected from. When
   * `false`, all databases are supported.
   */
  database: string | string[] | false;

  /**
   * Called with the newly created entry after it has been
   * created and added to the collection.
   */
  onCreateEntry?: (entry: DatabaseEntry) => void;

  /**
   * Called with the selected existing entry after it has been
   * added to the collection.
   */
  onAddEntry?: (entry: DatabaseEntry) => void;

  /**
   * Minimum width of the menu popup.
   * @default 300
   */
  popupWidth?: number;
}

/**
 * Renders an icon button that opens a searchable menu for adding
 * entries to a collection, either by creating a new entry or by
 * selecting an existing one.
 */
export const AddCollectionEntryButton: FC<AddCollectionEntryButtonProps> = ({
  collectionId,
  database,
  onCreateEntry,
  onAddEntry,
  popupWidth = 300,
  ...rest
}) => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation({ keyPrefix: 'collections.entries' });
  const allDatabases = Databases.useAll();
  const collection = Collections.use(collectionId);

  // Subscribe to entry changes so the listed options stay fresh
  DatabaseEntries.Store.useAllItemsArray();

  // Single database mode renders a flat list without group headings
  const singleDatabase = typeof database === 'string';

  // Database IDs to include, undefined when all are supported
  const databaseIds = resolveDatabaseIds(database);

  // Databases supported as create targets
  const supportedDatabases = databaseIds
    ? databaseIds.map((id) => Databases.get(id)).filter(Boolean)
    : allDatabases;

  // IDs of entries already in the collection
  const excludedIds = new Set(collection?.items ?? []);

  // Databases offered as create options: all supported when not
  // searching, fuzzy matched otherwise
  const createDatabases = query
    ? Databases.search(query, databaseIds)
    : supportedDatabases;

  // Templates matched by name while searching. Templates of a
  // matched database are already listed under it, so only templates
  // from other databases are added.
  const matchedTemplates = query
    ? Databases.searchEntryTemplates(query, databaseIds).filter(
        (result) =>
          !createDatabases.some(
            (createDatabase) => createDatabase.id === result.database.id,
          ),
      )
    : [];

  // Entries offered as add options: top fuzzy matches when
  // searching, newest first otherwise. Fetches extra newest
  // entries to account for excluded collection members.
  const matchedEntries = query
    ? DatabaseEntries.searchByTitle(query, databaseIds)
    : DatabaseEntries.getNewest(
        DEFAULT_ENTRIES_LIMIT + excludedIds.size,
        databaseIds,
      );

  // Exclude collection members and cap the option count
  const entries = matchedEntries
    .filter((entry) => !excludedIds.has(entry.id))
    .slice(0, query ? SEARCH_ENTRIES_LIMIT : DEFAULT_ENTRIES_LIMIT);

  // Reset the search query when the popup opens
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setQuery('');
    }
  }, []);

  // Create a new entry, optionally from a template, and add it to
  // the collection
  async function handleCreate(databaseId: string, templateId?: string) {
    const entry = templateId
      ? await DatabaseEntries.createFromTemplate(databaseId, templateId)
      : await DatabaseEntries.create(databaseId);

    await Collections.addItems(collectionId, [entry.id]);

    onCreateEntry?.(entry);
  }

  // Add an existing entry to the collection
  async function handleAdd(entry: DatabaseEntry) {
    await Collections.addItems(collectionId, [entry.id]);

    onAddEntry?.(entry);
  }

  // Render a database's create options. Databases with entry
  // templates nest their options in a submenu, with the blank entry
  // option first.
  function renderCreateItem(createDatabase: Database) {
    const contentIcon = createDatabase.icon || DATABASE_FALLBACK_ICON;
    const templates = createDatabase.entryTemplates ?? [];

    // Databases without templates create an entry directly
    if (!templates.length) {
      return (
        <DropdownSearchableMenuItem
          key={createDatabase.id}
          stringLabel={createDatabase.entryName}
          contentIcon={contentIcon}
          onSelect={() => handleCreate(createDatabase.id)}
        />
      );
    }

    return (
      <DropdownSubmenu key={createDatabase.id}>
        <DropdownSubmenuTriggerItem
          stringLabel={createDatabase.entryName}
          contentIcon={contentIcon}
        />
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
            <DropdownSubmenuContent minWidth={popupWidth}>
              <DropdownSearchableMenuItem
                stringLabel={createDatabase.entryName}
                contentIcon={contentIcon}
                onSelect={() => handleCreate(createDatabase.id)}
              />
              {templates.map((template) => (
                <DropdownSearchableMenuItem
                  key={template.id}
                  stringLabel={template.name}
                  contentIcon={contentIcon}
                  onSelect={() => handleCreate(createDatabase.id, template.id)}
                />
              ))}
            </DropdownSubmenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownSubmenu>
    );
  }

  // Render an existing entry's add option, icon'd by the database
  // it belongs to
  function renderEntryItem(entry: DatabaseEntry) {
    const entryDatabase = Databases.get(entry.database, false);

    return (
      <DropdownSearchableMenuItem
        key={entry.id}
        stringLabel={entry.title}
        contentIcon={entryDatabase?.icon || DATABASE_FALLBACK_ICON}
        onSelect={() => handleAdd(entry)}
      />
    );
  }

  // Render a database's create options as flat items. Used while
  // searching, where submenus are collapsed into the results list.
  function renderFlatCreateItems(createDatabase: Database) {
    return [
      <DropdownSearchableMenuItem
        key={createDatabase.id}
        stringLabel={createDatabase.entryName}
        contentIcon={createDatabase.icon || DATABASE_FALLBACK_ICON}
        onSelect={() => handleCreate(createDatabase.id)}
      />,
      ...(createDatabase.entryTemplates ?? []).map((template) =>
        renderFlatTemplateItem(createDatabase, template),
      ),
    ];
  }

  // Render a template's create option as a flat item, qualified by
  // entry name to stay distinguishable in a flat list
  function renderFlatTemplateItem(
    createDatabase: Database,
    template: DatabaseEntryTemplate,
  ) {
    return (
      <DropdownSearchableMenuItem
        key={`${createDatabase.id}:${template.id}`}
        stringLabel={`${createDatabase.entryName} · ${template.name}`}
        contentIcon={createDatabase.icon || DATABASE_FALLBACK_ICON}
        onSelect={() => handleCreate(createDatabase.id, template.id)}
      />
    );
  }

  return (
    <DropdownMenu
      searchable
      minWidth={popupWidth}
      searchTerm={query}
      onSearchTermChange={setQuery}
      searchPlaceholder="collections.entries.searchPlaceholder"
      emptyText={t('empty')}
      onOpenChange={handleOpenChange}
      trigger={
        <IconButton
          icon="plus"
          label="collections.entries.actions.add"
          {...rest}
        />
      }
    >
      {/* While searching, every option is listed flat so the menu
          can match it. Group headings and submenus are dropped. */}
      {query ? (
        <>
          {createDatabases.map(renderFlatCreateItems)}
          {matchedTemplates.map((result) =>
            renderFlatTemplateItem(result.database, result.template),
          )}
          {entries.map(renderEntryItem)}
        </>
      ) : (
        <>
          <DropdownMenuGroup
            label={
              singleDatabase ? undefined : 'collections.entries.groups.new'
            }
          >
            {createDatabases.map(renderCreateItem)}
          </DropdownMenuGroup>
          <DropdownMenuGroup
            label={
              singleDatabase ? undefined : 'collections.entries.groups.recent'
            }
          >
            {entries.map(renderEntryItem)}
          </DropdownMenuGroup>
        </>
      )}
    </DropdownMenu>
  );
};

/**
 * Normalizes the database prop into an array of database IDs, or
 * undefined when all databases are supported.
 */
function resolveDatabaseIds(
  database: string | string[] | false,
): string[] | undefined {
  // When false, all databases are supported
  if (database === false) {
    return undefined;
  }

  return Array.isArray(database) ? database : [database];
}
