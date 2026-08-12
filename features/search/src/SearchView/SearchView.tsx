import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  DatabaseEntries,
  Databases,
  OpenDatabaseEntryViewEvent,
  type OpenDatabaseEntryViewEventData,
  OpenDatabaseViewEvent,
  type OpenDatabaseViewEventData,
} from '@minddrop/databases';
import type { FullTextSearchResult } from '@minddrop/search';
import { PanelView } from '@minddrop/ui-components';
import {
  Icon,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useNavigableList,
  useTransientState,
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { SearchResultItem } from '../SearchResultItem';
import { useSearch } from '../useSearch';
import { filterMatchedProperties } from '../utils';
import './SearchView.css';

// Number of recent entries listed while the query is empty
const RECENT_ENTRY_COUNT = 12;

// Key under which the query is persisted in the pane's transient
// view state
const QUERY_STATE_KEY = 'search-view-query';

// Frames over which the search field tries to claim focus, covering
// the close transition of a menu the view was opened from
const MAX_FOCUS_ATTEMPTS = 40;

// Consecutive frames the search field must keep focus before it is
// considered settled
const REQUIRED_FOCUS_FRAMES = 10;

/**
 * Renders the search view: a search field listing full-text search
 * results, falling back to the most recently modified entries while
 * the query is empty.
 */
export const SearchView: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Whether the persisted query has been restored, ensuring it is
  // only applied once
  const restoredRef = useRef(false);
  const { query, results, search, clear } = useSearch();
  const [storedQuery, setStoredQuery] = useTransientState<string>(
    QUERY_STATE_KEY,
    '',
  );
  const openView = Views.useOpenView();

  // The most recently modified entries, listed as an entry point
  // while there is no query
  const recentEntries = useMemo(
    () => DatabaseEntries.getRecent(RECENT_ENTRY_COUNT),
    [],
  );

  // Whether the view is listing search results rather than recents
  const showingResults = query.trim().length > 0;

  // The number of rows the keyboard navigation spans
  const itemCount = showingResults ? results.length : recentEntries.length;

  // Open a database entry in place of the search view, overriding the
  // database's own open mode so the result never opens elsewhere
  const openEntry = useCallback(
    (entryId: string) => {
      openView<OpenDatabaseEntryViewEventData>(OpenDatabaseEntryViewEvent, {
        entryId,
        openMode: 'in-place',
      });
    },
    [openView],
  );

  // Open a search result, which is either a database or an entry
  const openResult = useCallback(
    (result: FullTextSearchResult) => {
      // Open the database itself
      if (result.type === 'database') {
        openView<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
          databaseId: result.databaseId,
        });

        return;
      }

      // Open the matched entry
      openEntry(result.id);
    },
    [openEntry, openView],
  );

  // Open the row at the given index of whichever list is showing
  const selectItem = useCallback(
    (index: number) => {
      // Open the matched search result
      if (showingResults) {
        const result = results[index];

        if (result) {
          openResult(result);
        }

        return;
      }

      // Open the recent entry
      const entry = recentEntries[index];

      if (entry) {
        openEntry(entry.id);
      }
    },
    [showingResults, results, recentEntries, openResult, openEntry],
  );

  // Clear the query on Escape, keeping the view open
  const handleEscape = useCallback(
    (event: React.KeyboardEvent) => {
      if (!query.trim()) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      clear();
      setStoredQuery('');
    },
    [query, clear, setStoredQuery],
  );

  // Navigable list for keyboard/mouse highlight management
  const { getInputProps, getItemProps } = useNavigableList({
    itemCount,
    onSelect: selectItem,
    onEscape: handleEscape,
  });

  // Restore the query persisted for this pane, re-running its search
  useEffect(() => {
    if (restoredRef.current) {
      return;
    }

    restoredRef.current = true;

    if (storedQuery) {
      search(storedQuery);
    }
  }, [storedQuery, search]);

  // Focus the search field when the view is opened, retrying while
  // another element holds focus. Views opened from a menu mount while
  // the menu is still playing its close transition, during which its
  // focus trap pulls focus back out of the field.
  useEffect(() => {
    let attempts = 0;
    let heldFrames = 0;
    let frame = 0;

    function claimFocus() {
      const input = inputRef.current;

      // Nothing left to focus
      if (!input) {
        return;
      }

      if (document.activeElement === input) {
        heldFrames += 1;

        // Stop once the field has kept focus long enough for a trap
        // to have taken it back, as focus is returned asynchronously
        // and a single frame can observe it before that happens
        if (heldFrames >= REQUIRED_FOCUS_FRAMES) {
          return;
        }
      } else {
        // Something took focus, so start counting again
        heldFrames = 0;
        input.focus();
      }

      // Retry on the next frame, giving up once the budget runs out
      // so a deliberate click elsewhere is not fought indefinitely
      attempts += 1;

      if (attempts < MAX_FOCUS_ATTEMPTS) {
        frame = requestAnimationFrame(claimFocus);
      }
    }

    claimFocus();

    return () => cancelAnimationFrame(frame);
  }, []);

  // Run the search and persist the query for the pane
  const handleSearch = useCallback(
    (value: string) => {
      search(value);
      setStoredQuery(value);
    },
    [search, setStoredQuery],
  );

  // Search field, filling the panel header
  const searchInput = (
    <TextInput
      ref={inputRef}
      variant="ghost"
      size="sm"
      placeholder="search.placeholder"
      leading={<Icon name="search" color="muted" />}
      value={query}
      onValueChange={handleSearch}
      clearable
      unassisted
      className="search-view-input"
      {...getInputProps()}
    />
  );

  return (
    <PanelView className="search-view" header={searchInput}>
      {/* Results, or the recent entries when there is no query */}
      <ScrollArea className="search-view-list">
        <Stack className="search-view-content" gap={1}>
          {/* Heading above the recent entries */}
          {!showingResults && recentEntries.length > 0 && (
            <Text
              className="search-view-heading"
              text="search.recent"
              size="sm"
              color="muted"
            />
          )}

          {/* Search results */}
          {showingResults &&
            results.map((result, index) => {
              const itemProps = getItemProps(index);

              return (
                <SearchResultItem
                  key={`${result.type}:${result.id}`}
                  ref={itemProps.ref}
                  contentIcon={result.databaseIcon || undefined}
                  label={result.title}
                  matchedProperties={filterMatchedProperties(
                    result.matchedProperties,
                  )}
                  secondary={
                    result.type === 'entry' ? result.databaseName : undefined
                  }
                  highlighted={itemProps.highlighted}
                  onMouseMove={itemProps.onMouseMove}
                  onClick={() => openResult(result)}
                />
              );
            })}

          {/* Recent entries */}
          {!showingResults &&
            recentEntries.map((entry, index) => {
              const itemProps = getItemProps(index);
              const database = Databases.get(entry.database, false);

              return (
                <SearchResultItem
                  key={entry.id}
                  ref={itemProps.ref}
                  contentIcon={database?.icon || undefined}
                  label={entry.title}
                  secondary={database?.name}
                  highlighted={itemProps.highlighted}
                  onMouseMove={itemProps.onMouseMove}
                  onClick={() => openEntry(entry.id)}
                />
              );
            })}

          {/* Empty state shown when a query matches nothing */}
          {showingResults && results.length === 0 && (
            <Text
              className="search-view-empty"
              text="search.noResults"
              size="sm"
              color="muted"
            />
          )}
        </Stack>
      </ScrollArea>
    </PanelView>
  );
};
