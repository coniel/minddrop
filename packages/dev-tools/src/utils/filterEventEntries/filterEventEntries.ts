import { DevToolsEventEntry } from '../../types';
import { formatLogArgument } from '../formatLogArgument';
import { matchesEventNamePath } from '../matchesEventNamePath';

export interface FilterEventEntriesOptions {
  /**
   * Only events at or below this path in the event name tree
   * are kept.
   */
  path?: string | null;

  /**
   * Only events whose name or data contain this text are kept,
   * matched case insensitively.
   */
  search?: string;
}

/**
 * Filters captured events by event name path and search text.
 *
 * @param entries - The captured events to filter.
 * @param options - The filters to apply.
 * @returns The events matching every applied filter.
 */
export function filterEventEntries(
  entries: DevToolsEventEntry[],
  { path, search }: FilterEventEntriesOptions = {},
): DevToolsEventEntry[] {
  const query = search?.trim().toLowerCase() ?? '';

  return entries.filter((entry) => {
    // Drop events outside the selected part of the name tree
    if (!matchesEventNamePath(entry.name, path ?? null)) {
      return false;
    }

    // Drop events whose name and data do not contain the search text
    if (query && !getSearchText(entry).includes(query)) {
      return false;
    }

    return true;
  });
}

/**
 * Returns an event's name and data as a single lowercased string
 * to match search text against.
 */
function getSearchText(entry: DevToolsEventEntry): string {
  return `${entry.name} ${formatLogArgument(entry.data)}`.toLowerCase();
}
