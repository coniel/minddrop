import { useMemo } from 'react';
import { Database } from './types';
import { SortableEntryProperty, resolveSortableEntryProperties } from './utils';

/**
 * Lists the properties the given databases' entries can be
 * sorted by.
 *
 * @param databases - The databases the entries belong to.
 * @returns The properties the entries can be sorted by.
 */
export function useSortableEntryProperties(
  databases: Database[],
): SortableEntryProperty[] {
  return useMemo(() => resolveSortableEntryProperties(databases), [databases]);
}
