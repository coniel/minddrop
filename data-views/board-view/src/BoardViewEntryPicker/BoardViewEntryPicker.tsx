import React, { useEffect, useRef, useState } from 'react';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import { DATABASE_FALLBACK_ICON } from '@minddrop/ui-components';
import {
  Group,
  KeyboardShortcut,
  SearchableMenu,
  SearchableMenuItem,
  Text,
} from '@minddrop/ui-primitives';
import './BoardViewEntryPicker.css';

// Maximum number of entries listed at once
const ENTRIES_LIMIT = 8;

export interface BoardViewEntryPickerProps {
  /**
   * The IDs of the entries excluded from the results, typically
   * the entries already on the board.
   */
  excludeIds: string[];

  /**
   * Called with the selected entry's ID.
   */
  onSelect: (entryId: string) => void;

  /**
   * Called with the selected entry's ID on secondary (shift)
   * selection, after which the picker stays open with a cleared
   * search for picking further entries.
   */
  onSecondarySelect: (entryId: string) => void;

  /**
   * Called when the picker is dismissed without a selection.
   */
  onDismiss: () => void;
}

/**
 * Renders a placeholder card with a search box for picking an
 * existing database entry.
 */
export const BoardViewEntryPicker: React.FC<BoardViewEntryPickerProps> = ({
  excludeIds,
  onSelect,
  onSecondarySelect,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const { t } = useTranslation({ keyPrefix: 'dataViews.board' });

  // Subscribe to entry changes so the listed options stay fresh
  DatabaseEntries.Store.useAllItemsArray();

  // Entries offered as options: top fuzzy matches when searching,
  // newest first otherwise. Fetches extra newest entries to
  // account for excluded board members.
  const matchedEntries = query
    ? DatabaseEntries.searchByTitle(query)
    : DatabaseEntries.getNewest(ENTRIES_LIMIT + excludeIds.length);

  // Exclude board members and cap the option count
  const entries = matchedEntries
    .filter((entry) => !excludeIds.includes(entry.id))
    .slice(0, ENTRIES_LIMIT);

  // Bring the picker into view if the drop position only
  // partially fit on screen. Runs a frame after the search
  // input's scroll-free auto-focus.
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollIntoView);
    });
  }, []);

  // Dismiss the picker on Escape. The search field clears a
  // non-empty query itself and stops propagation, so only an
  // empty query reaches here.
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      onDismiss();
    }
  }

  // Keep focus in the search input when pressing the picker's
  // other elements, so selection clicks never blur the input
  function handleMouseDown(event: React.MouseEvent) {
    if (!(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
    }
  }

  // Dismiss the picker when focus leaves it. Selection clicks
  // never blur the input, so any blur out of the picker is an
  // outside interaction.
  function handleBlur(event: React.FocusEvent) {
    // Focus moved within the picker
    if (
      event.relatedTarget &&
      containerRef.current?.contains(event.relatedTarget)
    ) {
      return;
    }

    onDismiss();
  }

  // Select an entry but keep the picker open with a cleared
  // search for picking further entries
  function handleSecondarySelect(entryId: string) {
    setQuery('');
    onSecondarySelect(entryId);

    // Keep the picker in view once the added entry has pushed
    // it down. Deferred to the frame after the layout update.
    requestAnimationFrame(scrollIntoView);
  }

  // Scroll the picker fully into view within the board
  function scrollIntoView() {
    containerRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }

  // Render an entry option, icon'd by the database it belongs to
  function renderEntryItem(entry: DatabaseEntry) {
    const entryDatabase = Databases.get(entry.database, false);

    return (
      <SearchableMenuItem
        key={entry.id}
        stringLabel={entry.title}
        contentIcon={entryDatabase?.icon || DATABASE_FALLBACK_ICON}
        onSelect={() => onSelect(entry.id)}
        secondaryOnSelect={() => handleSecondarySelect(entry.id)}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="board-view-entry-picker"
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onBlur={handleBlur}
    >
      <SearchableMenu
        searchTerm={query}
        onSearchTermChange={setQuery}
        searchPlaceholder="dataViews.board.searchEntriesPlaceholder"
        emptyText={t('entrySearchEmpty')}
      >
        {entries.map(renderEntryItem)}
      </SearchableMenu>

      {/* Keyboard hint */}
      <Group gap={1} className="board-view-entry-picker-hint">
        <KeyboardShortcut keys={['Enter']} size="xs" color="subtle" />
        <Text size="xs" color="subtle">
          {t('entryPickerAddHint')}
        </Text>
        <Text size="xs" color="subtle">
          ·
        </Text>
        <KeyboardShortcut keys={['Shift', 'Enter']} size="xs" color="subtle" />
        <Text size="xs" color="subtle">
          {t('entryPickerAddMoreHint')}
        </Text>
      </Group>
    </div>
  );
};
