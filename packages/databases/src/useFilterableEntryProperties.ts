import { useMemo } from 'react';
import { PropertiesSchema } from '@minddrop/properties';
import { Database } from './types';
import { resolveFilterableEntryProperties } from './utils';

/**
 * Lists the properties the given databases' entries can be
 * filtered by: the entry metadata properties, and the properties
 * every database declares under the same name and type.
 * Properties of a type with no comparison operators are left out.
 *
 * @param databases - The databases the entries belong to.
 * @returns The properties the entries can be filtered by.
 */
export function useFilterableEntryProperties(
  databases: Database[],
): PropertiesSchema {
  return useMemo(
    () => resolveFilterableEntryProperties(databases),
    [databases],
  );
}
