import React, { useState } from 'react';
import {
  Database,
  DatabaseEntries,
  DatabaseEntryTemplate,
  DatabaseEntryTemplates,
  Databases,
  Entry,
  EntryCreationOption,
} from '@minddrop/databases';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  MenuGroup,
  MenuLabel,
  SearchableMenu,
  SearchableMenuItem,
  SearchableMenuProps,
} from '@minddrop/ui-primitives';

// How many recent entries are listed before anything is searched for
const DefaultLimit = 10;

// How many matched entries are listed while searching
const SearchLimit = 15;

export interface AddedContent {
  /**
   * The added entry's ID.
   */
  id: string;

  /**
   * Whether the entry was created by the menu rather than picked
   * from the content which already exists.
   */
  created: boolean;
}

export interface AddContentMenuProps
  extends Omit<SearchableMenuProps, 'children' | 'onSelect'> {
  /**
   * The IDs of the databases and entry templates offered first, in
   * the order they are given.
   */
  suggested?: string[];

  /**
   * The IDs of the entries the consumer already holds. The menu
   * leaves them out.
   */
  excludeIds?: string[];

  /**
   * How many recent entries are listed before anything is searched
   * for.
   *
   * @default 10
   */
  limit?: number;

  /**
   * Called with the added content.
   */
  onAdd: (content: AddedContent) => void;

  /**
   * Called with the added content on secondary (shift) selection.
   * The menu stays open for adding further content.
   */
  onSecondaryAdd?: (content: AddedContent) => void;
}

/**
 * Renders a searchable menu for creating a new entry or picking one
 * which already exists.
 */
export const AddContentMenu = React.forwardRef<
  HTMLDivElement,
  AddContentMenuProps
>(
  (
    {
      suggested = [],
      excludeIds = [],
      limit = DefaultLimit,
      onAdd,
      onSecondaryAdd,
      ...other
    },
    ref,
  ) => {
    const [query, setQuery] = useState('');
    const { t } = useTranslation({ keyPrefix: 'addContent' });

    // Resolve the suggested databases and templates, in the order given
    const suggestions = suggested
      .map(resolveSuggestion)
      .filter((suggestion): suggestion is EntryCreationOption =>
        Boolean(suggestion),
      );

    // Leave the suggested databases out of the remaining ones
    const remainingDatabases = Databases.getAll().filter(
      (database) => !suggested.includes(database.id),
    );

    // Search the ways a new entry can be created
    const matchedCreations = query
      ? DatabaseEntries.searchCreationOptions(query)
      : [];

    // Search the entries, or take the most recent while nothing is
    // searched for.
    const matchedEntries = query
      ? DatabaseEntries.searchByTitle(query)
      : DatabaseEntries.getRecent(limit, { exclude: excludeIds });

    // Leave out the entries the consumer already holds and cap the
    // list at the limit.
    const entries = matchedEntries
      .filter((entry) => !excludeIds.includes(entry.id))
      .slice(0, query ? SearchLimit : limit);

    // Resolve a suggested ID into its creation option. The ID is a
    // database's or an entry template's.
    function resolveSuggestion(
      suggestionId: string,
    ): EntryCreationOption | null {
      // Check whether the ID is a database's
      const database = Databases.get(suggestionId, false);

      if (database) {
        return { database };
      }

      // Look the ID up as an entry template's
      const template = DatabaseEntryTemplates.get(suggestionId, false);

      if (!template) {
        return null;
      }

      // Pair the template with its database, dropping it if the
      // database no longer exists.
      const templateDatabase = Databases.get(template.database, false);

      return templateDatabase ? { database: templateDatabase, template } : null;
    }

    // Create an entry and report it as added
    async function addNewEntry(
      database: Database,
      template: DatabaseEntryTemplate | undefined,
      secondary: boolean,
    ) {
      // Create from the template when one was picked
      const entry = template
        ? await DatabaseEntries.createFromTemplate(template.id)
        : await DatabaseEntries.create(database.id);

      // Report the new entry
      reportAdded({ id: entry.id, created: true }, secondary);
    }

    // Report an existing entry as added
    function addExistingEntry(entry: Entry, secondary: boolean) {
      reportAdded({ id: entry.id, created: false }, secondary);
    }

    // Hand the added content to the consumer
    function reportAdded(content: AddedContent, secondary: boolean) {
      // A secondary selection clears the search and keeps the menu
      // open for adding more.
      if (secondary) {
        setQuery('');
        onSecondaryAdd?.(content);

        return;
      }

      // Report the content and let the menu close
      onAdd(content);
    }

    // Render a creation option, labelled with the entry name it
    // creates.
    function renderCreationItem({ database, template }: EntryCreationOption) {
      return (
        <SearchableMenuItem
          key={template ? `${database.id}:${template.id}` : database.id}
          stringLabel={resolveCreationLabel(database, template)}
          contentIcon={database.icon}
          onSelect={() => addNewEntry(database, template, false)}
          secondaryOnSelect={
            onSecondaryAdd
              ? () => addNewEntry(database, template, true)
              : undefined
          }
        />
      );
    }

    // Render an existing entry's option
    function renderEntryItem(entry: Entry) {
      return (
        <SearchableMenuItem
          key={entry.id}
          stringLabel={entry.title}
          contentIcon={DatabaseEntries.resolveIcon(entry)}
          onSelect={() => addExistingEntry(entry, false)}
          secondaryOnSelect={
            onSecondaryAdd ? () => addExistingEntry(entry, true) : undefined
          }
        />
      );
    }

    // Render the searched listing
    function renderSearchResults() {
      return (
        <>
          {/** The matched ways to create an entry **/}
          {renderGroup(
            'addContent.groups.new',
            matchedCreations.map(renderCreationItem),
          )}
          {/** The matched entries **/}
          {renderGroup(
            'addContent.groups.existing',
            entries.map(renderEntryItem),
          )}
        </>
      );
    }

    // Render the listing shown before anything is searched for
    function renderListing() {
      return (
        <>
          {/** The suggested databases and templates **/}
          {renderGroup(
            'addContent.groups.suggested',
            suggestions.map(renderCreationItem),
          )}
          {/** The remaining databases **/}
          {renderGroup(
            'addContent.groups.new',
            remainingDatabases.map((database) =>
              renderCreationItem({ database }),
            ),
          )}
          {/** The most recent entries **/}
          {renderGroup(
            'addContent.groups.recent',
            entries.map(renderEntryItem),
          )}
        </>
      );
    }

    // Render a labelled group of items. Renders nothing when the
    // group has no items.
    function renderGroup(label: TranslationKey, items: React.ReactNode[]) {
      if (!items.length) {
        return null;
      }

      return (
        <MenuGroup>
          <MenuLabel label={label} />
          {items}
        </MenuGroup>
      );
    }

    return (
      <SearchableMenu
        ref={ref}
        searchTerm={query}
        onSearchTermChange={setQuery}
        searchPlaceholder="addContent.searchPlaceholder"
        emptyText={t('empty')}
        {...other}
      >
        {query ? renderSearchResults() : renderListing()}
      </SearchableMenu>
    );
  },
);

AddContentMenu.displayName = 'AddContentMenu';

/**
 * Returns the name a creation option is listed under.
 *
 * @param database - The database the entry is created in.
 * @param template - The entry template the entry is created from.
 * @returns The database's entry name, qualified by the template's name when there is one.
 */
function resolveCreationLabel(
  database: Database,
  template?: DatabaseEntryTemplate,
): string {
  if (!template) {
    return database.entryName;
  }

  return `${database.entryName} · ${template.name}`;
}
