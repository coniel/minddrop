import {
  DevToolsLogEntry,
  DevToolsLogLevel,
  DevToolsLogQuickFilter,
} from '../../types';
import { formatLogArgument } from '../formatLogArgument';
import { getLogLabel } from '../getLogLabel';

export interface FilterLogEntriesOptions {
  /**
   * Only entries of this level are kept.
   */
  level?: DevToolsLogLevel | null;

  /**
   * Only entries whose values contain this text are kept,
   * matched case insensitively.
   */
  search?: string;

  /**
   * Only entries matching this label or source file are kept.
   */
  quickFilter?: DevToolsLogQuickFilter | null;
}

/**
 * Filters log entries by level, search text, and quick filter.
 *
 * @param entries - The log entries to filter.
 * @param options - The filters to apply.
 * @returns The entries matching every applied filter.
 */
export function filterLogEntries(
  entries: DevToolsLogEntry[],
  { level, search, quickFilter }: FilterLogEntriesOptions = {},
): DevToolsLogEntry[] {
  const query = search?.trim().toLowerCase() ?? '';

  return entries.filter((entry) => {
    // Drop entries from other console methods
    if (level && entry.level !== level) {
      return false;
    }

    // Drop entries with a different label
    if (
      quickFilter?.type === 'label' &&
      getLogLabel(entry) !== quickFilter.value
    ) {
      return false;
    }

    // Drop entries logged from a different file
    if (
      quickFilter?.type === 'file' &&
      entry.source?.file !== quickFilter.value
    ) {
      return false;
    }

    // Drop entries whose values do not contain the search text
    if (query && !getSearchText(entry).includes(query)) {
      return false;
    }

    return true;
  });
}

/**
 * Returns an entry's values as a single lowercased string to
 * match search text against.
 */
function getSearchText(entry: DevToolsLogEntry): string {
  return entry.args.map(formatLogArgument).join(' ').toLowerCase();
}
