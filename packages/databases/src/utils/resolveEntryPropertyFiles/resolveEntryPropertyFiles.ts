import { Properties, PropertyType } from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';
import { getEntry } from '../../getEntry';
import { Entry, EntryPropertyFile } from '../../types';
import { resolveEntryPropertyFilePath } from '../resolveEntryPropertyFilePath';

export interface ResolveEntryPropertyFilesOptions {
  /**
   * The property types to restrict the files to. Defaults to every
   * file based type.
   */
  propertyTypes?: PropertyType[];

  /**
   * The workspace path. Defaults to the active workspace.
   */
  workspacePath?: string;
}

/**
 * Returns the files an entry's file based properties hold. Properties
 * without a file value are skipped.
 *
 * @param entry - The entry, or its ID.
 * @param options - The property types to restrict the files to and the workspace path.
 * @returns The entry's property files.
 */
export function resolveEntryPropertyFiles(
  entry: Entry | string,
  options: ResolveEntryPropertyFilesOptions = {},
): EntryPropertyFile[] {
  const { propertyTypes, workspacePath } = options;

  // Look the entry up when given its ID
  const resolvedEntry = typeof entry === 'string' ? getEntry(entry) : entry;

  // Get the entry's database
  const database = getDatabase(resolvedEntry.database);

  // Filter for the file based properties, restricted to the given
  // types when some are given.
  const fileProperties = database.properties
    .filter(Properties.isFileBased)
    .filter(
      (property) => !propertyTypes || propertyTypes.includes(property.type),
    );

  // Resolve the file of each property with a file value
  return fileProperties.flatMap((property) => {
    // Get the property's value
    const value = resolvedEntry.properties[property.name];

    // Skip properties without a file value
    if (typeof value !== 'string' || value === '') {
      return [];
    }

    // Resolve the file's path
    return [
      {
        property: property.name,
        path: resolveEntryPropertyFilePath(
          resolvedEntry,
          property.name,
          value,
          workspacePath,
        ),
      },
    ];
  });
}
