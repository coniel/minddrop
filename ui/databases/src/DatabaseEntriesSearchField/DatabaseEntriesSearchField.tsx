import React, { useEffect, useMemo } from 'react';
import { DatabaseEntries } from '@minddrop/databases';
import {
  Icon,
  TextInput,
  TextInputSize,
  TextInputVariant,
  useTransientState,
} from '@minddrop/ui-primitives';
import { fuzzySearchBy } from '@minddrop/utils';

export interface DatabaseEntriesSearchFieldProps {
  /**
   * The full list of entry IDs to search through.
   */
  entryIds: string[];

  /**
   * Called with the filtered entry IDs whenever the query changes.
   */
  onFilteredEntriesChange: (filteredEntryIds: string[]) => void;

  /**
   * Records and restores the search query via the surrounding
   * transient view state context, under this key within the
   * current scope. Omit to opt out.
   */
  stateKey?: string;

  /**
   * Visual style of the input.
   */
  variant?: TextInputVariant;

  /**
   * Height of the input.
   */
  size?: TextInputSize;

  /**
   * Class name applied to the wrapper element.
   */
  className?: string;
}

/**
 * Renders a search field that fuzzy-filters database entries by title.
 */
export const DatabaseEntriesSearchField: React.FC<
  DatabaseEntriesSearchFieldProps
> = ({
  entryIds,
  onFilteredEntriesChange,
  stateKey,
  variant = 'subtle',
  size,
  className,
}) => {
  // Track the search query, persisted per tab when opted in
  const [searchQuery, setSearchQuery] = useTransientState(stateKey, '');

  // Build a map of entry ID to title for fuzzy searching
  const entryTitles = useMemo(() => {
    const map: Record<string, string> = {};

    for (const entryId of entryIds) {
      const entry = DatabaseEntries.get(entryId, false);

      // Entries which are not loaded have no title to match on
      map[entryId] = entry?.title ?? '';
    }

    return map;
  }, [entryIds]);

  // Filter entries based on the search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) {
      return entryIds;
    }

    // Matching on the entry IDs rather than on their titles keeps
    // entries which share a title distinct
    return fuzzySearchBy(entryIds, searchQuery, (id) => entryTitles[id] ?? '');
  }, [entryIds, entryTitles, searchQuery]);

  // Notify the parent whenever the filtered results change
  useEffect(() => {
    onFilteredEntriesChange(filteredEntries);
  }, [filteredEntries, onFilteredEntriesChange]);

  // Clear the search query
  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <TextInput
      variant={variant}
      size={size}
      className={className}
      placeholder="actions.search"
      leading={<Icon name="search" />}
      value={searchQuery}
      onValueChange={setSearchQuery}
      clearable
      onClear={handleClear}
      unassisted
    />
  );
};
