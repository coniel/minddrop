import React, { useCallback, useEffect, useState } from 'react';
import {
  OpenDatabaseEntryViewEvent,
  type OpenDatabaseEntryViewEventData,
  OpenDatabaseViewEvent,
  type OpenDatabaseViewEventData,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import type { FullTextSearchResult } from '@minddrop/search';
import {
  Dialog,
  DialogRoot,
  Icon,
  ScrollArea,
  Stack,
  TextInput,
  useNavigableList,
} from '@minddrop/ui-primitives';
import { SearchResultItem } from '../SearchResultItem';
import { OpenSearchDialogEvent, SearchFeatureEventListenerId } from '../events';
import { useSearch } from '../useSearch';
import { filterMatchedProperties } from '../utils';
import './SearchDialog.css';

/**
 * Renders a search dialog with a text input and a scrollable
 * results area. Listens for the open event and Cmd/Ctrl+K
 * keyboard shortcut.
 */
export const SearchDialog: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const { query, results, search, clear } = useSearch();

  // Navigable list for keyboard/mouse highlight management
  const { getInputProps, getContainerProps, getItemProps } = useNavigableList({
    itemCount: results.length,
    onSelect: (index) => selectResult(results[index]),
    onEscape: (event) => {
      // Escape clears the input first, closes dialog only
      // when empty
      if (query.trim()) {
        event.preventDefault();
        event.stopPropagation();
        clear();
      }
    },
  });

  // Listen for open search dialog events
  useEffect(() => {
    Events.addListener(
      OpenSearchDialogEvent,
      SearchFeatureEventListenerId,
      () => {
        setOpen(true);
      },
    );

    return () => {
      Events.removeListener(
        OpenSearchDialogEvent,
        SearchFeatureEventListenerId,
      );
    };
  }, []);

  // Open search dialog with Cmd/Ctrl+K
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Clear the search when the dialog is closed
  const handleOpenChange = useCallback(
    (value: boolean) => {
      setOpen(value);

      if (!value) {
        clear();
      }
    },
    [clear],
  );

  // Open the selected result
  const selectResult = useCallback(
    (result: FullTextSearchResult) => {
      if (result.type === 'database') {
        Events.dispatch<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
          databaseId: result.databaseId,
        });
      } else if (result.type === 'entry') {
        Events.dispatch<OpenDatabaseEntryViewEventData>(OpenDatabaseEntryViewEvent, {
          entryId: result.id,
        });
      }

      setOpen(false);
      clear();
    },
    [clear],
  );

  // Focus the input when the dialog opens
  const handleDialogRendered = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, []);

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <Dialog ref={handleDialogRendered} noPadding className="search-dialog">
        {/* Search input */}
        <div className="search-dialog-input-container">
          <TextInput
            ref={inputRef}
            variant="ghost"
            size="lg"
            placeholder="search.placeholder"
            leading={<Icon name="search" color="muted" />}
            value={query}
            onValueChange={search}
            clearable
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            {...getInputProps()}
          />
        </div>

        {/* Results area, hidden when there is no query */}
        {query.trim() && (
          <div className="search-dialog-results" {...getContainerProps()}>
            <ScrollArea>
              <Stack className="search-dialog-results-content">
                {results.map((result, index) => {
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
                        result.type === 'entry'
                          ? result.databaseName
                          : undefined
                      }
                      highlighted={itemProps.highlighted}
                      onMouseMove={itemProps.onMouseMove}
                      onClick={itemProps.onClick}
                    />
                  );
                })}
              </Stack>
            </ScrollArea>
          </div>
        )}
      </Dialog>
    </DialogRoot>
  );
};
