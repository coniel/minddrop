import React, { useEffect, useMemo, useState } from 'react';
import { DatabaseEntries } from '@minddrop/databases';
import {
  Icon,
  TextInput,
  TextInputSize,
  TextInputVariant,
} from '@minddrop/ui-primitives';
import { fuzzySearch } from '@minddrop/utils';

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
  variant = 'subtle',
  size,
  className,
}) => {
  // Track the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Build a map of entry ID to title for fuzzy searching
  const entryTitles = useMemo(() => {
    const map: Record<string, string> = {};

    for (const entryId of entryIds) {
      const entry = DatabaseEntries.get(entryId);
      map[entryId] = entry.title;
    }

    return map;
  }, [entryIds]);

  // Filter entries based on the search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) {
      return entryIds;
    }

    // Build a parallel array of titles
    const titles = entryIds.map((id) => entryTitles[id] || '');

    // Run fuzzy search on the titles
    const matchedTitles = fuzzySearch(titles, searchQuery);

    // Map matched titles back to entry IDs by finding the index
    // of each matched title in the original titles array
    return matchedTitles
      .map((title) => {
        const index = titles.indexOf(title);

        return index !== -1 ? entryIds[index] : null;
      })
      .filter((id): id is string => id !== null);
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
    />
  );
};
