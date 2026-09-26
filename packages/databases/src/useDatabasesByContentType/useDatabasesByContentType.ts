import { useMemo } from 'react';
import { useDatabases } from '../DatabasesStore';
import { ContentType, Database } from '../types';
import { filterDatabasesByContentType } from '../utils';

/**
 * Retrieves the databases with a property which can hold content of
 * a given type.
 *
 * @param contentType - The content type.
 * @returns The databases accepting the content type.
 */
export function useDatabasesByContentType(
  contentType: ContentType,
): Database[] {
  // Get every database
  const databases = useDatabases();

  // Filter for the databases accepting the content type
  return useMemo(
    () => filterDatabasesByContentType(databases, contentType),
    [databases, contentType],
  );
}
