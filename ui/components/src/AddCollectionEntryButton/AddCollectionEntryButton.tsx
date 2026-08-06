import { FC, useCallback, useState } from 'react';
import { Collections } from '@minddrop/collections';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import {
  Combobox,
  ComboboxOption,
  ComboboxOptionGroup,
  ComboboxProps,
  IconButton,
  IconButtonProps,
} from '@minddrop/ui-primitives';

// Maximum number of entries listed when not searching
const DEFAULT_ENTRIES_LIMIT = 10;

// Maximum number of matched entries listed when searching
const SEARCH_ENTRIES_LIMIT = 15;

// Fallback icon for databases without a custom icon
const DATABASE_FALLBACK_ICON = 'content-icon:shapes:inherit';

// Value prefix distinguishing create options from entry options
const CREATE_VALUE_PREFIX = 'create:';

// Action performed when an option is selected
type EntryAction =
  | { type: 'create'; databaseId: string }
  | { type: 'add'; entry: DatabaseEntry };

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
   * Width of the menu popup.
   * @default 300
   */
  popupWidth?: ComboboxProps['popupWidth'];
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

  // Single database mode renders a flat list without groups
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

  // Map of option values to their selection actions
  const actions = new Map<string, EntryAction>();

  // Create option for each database, labelled by entry name
  const createOptions: ComboboxOption[] = createDatabases.map(
    (createDatabase) => {
      const value = `${CREATE_VALUE_PREFIX}${createDatabase.id}`;

      actions.set(value, { type: 'create', databaseId: createDatabase.id });

      return {
        value,
        label: createDatabase.entryName,
        contentIcon: createDatabase.icon || DATABASE_FALLBACK_ICON,
      };
    },
  );

  // Add option for each existing entry
  const entryOptions: ComboboxOption[] = entries.map((entry) => {
    actions.set(entry.id, { type: 'add', entry });

    return {
      value: entry.id,
      label: entry.title,
    };
  });

  // Flat list in single database mode, grouped otherwise
  const items = singleDatabase
    ? [...createOptions, ...entryOptions]
    : undefined;
  const groups = singleDatabase
    ? undefined
    : buildOptionGroups(createOptions, entryOptions);

  // Reset the search query when the popup opens
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setQuery('');
    }
  }, []);

  // Performs the selected option's action
  async function handleValueChange(
    value: ComboboxOption | ComboboxOption[] | null,
  ) {
    // The combobox is single-select, multi values never occur
    if (Array.isArray(value) || !value) {
      return;
    }

    const action = actions.get(value.value);

    // Guard against unknown option values
    if (!action) {
      return;
    }

    // Create a new entry and add it to the collection
    if (action.type === 'create') {
      const entry = await DatabaseEntries.create(action.databaseId);

      await Collections.addItems(collectionId, [entry.id]);

      onCreateEntry?.(entry);

      return;
    }

    // Add the selected existing entry to the collection
    await Collections.addItems(collectionId, [action.entry.id]);

    onAddEntry?.(action.entry);
  }

  return (
    <Combobox
      trigger={
        <IconButton
          icon="plus"
          label="collections.entries.actions.add"
          {...rest}
        />
      }
      items={items}
      groups={groups}
      filteredItems={groups ?? items}
      inputValue={query}
      onInputValueChange={setQuery}
      value={null}
      onValueChange={handleValueChange}
      onOpenChange={handleOpenChange}
      searchPlaceholder="actions.search"
      emptyText={t('empty')}
      popupWidth={popupWidth}
    />
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

/**
 * Builds the New/Existing option groups, omitting empty groups.
 */
function buildOptionGroups(
  createOptions: ComboboxOption[],
  entryOptions: ComboboxOption[],
): ComboboxOptionGroup[] {
  const groups: ComboboxOptionGroup[] = [];

  // Group of create options, skipped when empty
  if (createOptions.length) {
    groups.push({
      value: 'new',
      label: 'collections.entries.groups.new',
      items: createOptions,
    });
  }

  // Group of existing entry options, skipped when empty
  if (entryOptions.length) {
    groups.push({
      value: 'existing',
      label: 'collections.entries.groups.existing',
      items: entryOptions,
    });
  }

  return groups;
}
