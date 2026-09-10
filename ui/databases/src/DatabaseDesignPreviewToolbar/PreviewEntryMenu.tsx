import { useMemo, useState } from 'react';
import { DatabaseEntries, DatabaseEntry } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import {
  ContentIcon,
  DropdownMenu,
  DropdownSearchableMenuItem,
  ToolbarButton,
} from '@minddrop/ui-primitives';

export interface PreviewEntryMenuProps {
  /**
   * The ID of the database the entries belong to.
   */
  databaseId: string;

  /**
   * The database's entries.
   */
  entries: DatabaseEntry[];

  /**
   * The ID of the previewed entry.
   */
  entryId?: string;

  /**
   * The database's icon, shown on the trigger.
   */
  icon?: string;

  /**
   * Callback fired with the picked entry's ID.
   */
  onEntryChange: (entryId: string) => void;
}

// Maximum number of entries listed at once
const EntriesLimit = 8;

// Width of the menu panel, wide enough for an entry title
const MenuWidth = 240;

/**
 * Renders the picker for the entry a design is previewed against:
 * a toolbar button labelled with the entry, opening a searchable
 * menu of the database's entries, newest first.
 */
export const PreviewEntryMenu: React.FC<PreviewEntryMenuProps> = ({
  databaseId,
  entries,
  entryId,
  icon,
  onEntryChange,
}) => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  // The entries offered as options: the top matches while
  // searching, the newest entries otherwise.
  const options = useMemo(() => {
    const matched = query
      ? DatabaseEntries.searchByTitle(query, [databaseId])
      : DatabaseEntries.sort(entries);

    return matched.slice(0, EntriesLimit);
  }, [query, databaseId, entries]);

  // The previewed entry, absent while none is picked
  const entry = entries.find((entry) => entry.id === entryId);

  // Clear the search when the menu closes so that it reopens
  // listing the newest entries.
  function handleOpenChange(open: boolean) {
    if (!open) {
      setQuery('');
    }
  }

  // Renders an entry's menu item
  function renderItem(entry: DatabaseEntry) {
    return (
      <DropdownSearchableMenuItem
        key={entry.id}
        stringLabel={entry.title}
        onSelect={() => onEntryChange(entry.id)}
      />
    );
  }

  return (
    <DropdownMenu
      searchable
      side="bottom"
      align="end"
      minWidth={MenuWidth}
      searchTerm={query}
      onSearchTermChange={setQuery}
      onOpenChange={handleOpenChange}
      searchPlaceholder="databases.entries.pickers.searchEntriesPlaceholder"
      emptyText={t('databases.entries.pickers.entrySearchEmpty')}
      trigger={
        <ToolbarButton
          size="sm"
          variant="subtle"
          startIcon={<ContentIcon icon={icon} />}
          endIcon="chevron-down"
        >
          {/* A span rather than Text so the title inherits the
              button's typography */}
          <span className="database-design-preview-toolbar-title">
            {entry?.title}
          </span>
        </ToolbarButton>
      }
    >
      {options.map(renderItem)}
    </DropdownMenu>
  );
};
