import { Layout } from '@minddrop/designs';
import { PropertyValue } from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';
import { getDatabaseEntry } from '../../getDatabaseEntry';
import { createEntryVirtualViews } from '../createEntryVirtualViews';
import { entryMetadataPropertyValues } from '../entryMetadataPropertyValues';
import { resolveEntryPropertyFilePath } from '../resolveEntryPropertyFilePath';

/**
 * Returns the display-ready property values for a database entry.
 * Transforms raw stored values into their display versions:
 *
 * - Image properties: file names are replaced with full file paths
 * - Collection properties: entry ID arrays are replaced with
 *   virtual view IDs (creating virtual collections and views
 *   as needed)
 *
 * @param entryId - The database entry ID.
 * @param layout - The layout being used to render the entry.
 * @param propertyMap - Map of element IDs to property names.
 * @returns A map of property names to display-ready values.
 */
export function entryDisplayPropertyValues(
  entryId: string,
  layout: Layout,
  propertyMap: Record<string, string>,
): Record<string, PropertyValue> {
  const entry = getDatabaseEntry(entryId, false);

  if (!entry) {
    return {};
  }

  const database = getDatabase(entry.database, false);

  if (!database) {
    return {};
  }

  // Start with the entry's raw property values, backed by its
  // metadata so title/timestamp properties resolve even when the
  // schema does not declare them
  const values: Record<string, PropertyValue> = {
    ...entryMetadataPropertyValues(entry, database.properties),
    ...entry.properties,
  };

  // Create virtual views for collection properties
  const virtualViewIds = createEntryVirtualViews(entryId, layout, propertyMap);

  // Transform property values to their display versions
  for (const property of database.properties) {
    const value = values[property.name];

    // Replace image file names with full file paths
    if (property.type === 'image' && typeof value === 'string') {
      values[property.name] = resolveEntryPropertyFilePath(
        entryId,
        property.name,
        value,
      );
    }

    // Replace collection values with virtual view IDs
    if (property.type === 'collection' && virtualViewIds[property.name]) {
      values[property.name] = virtualViewIds[property.name];
    }
  }

  return values;
}
