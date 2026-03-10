import { Design } from '@minddrop/designs';
import { PropertyValue } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { createEntryVirtualViews } from '../createEntryVirtualViews';
import { getPropertyFilePath } from '../getPropertyFilePath';

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
 * @param design - The design being used to render the entry.
 * @param propertyMap - Map of element IDs to property names.
 * @returns A map of property names to display-ready values.
 */
export function entryDisplayPropertyValues(
  entryId: string,
  design: Design,
  propertyMap: Record<string, string>,
): Record<string, PropertyValue> {
  const entry = DatabaseEntriesStore.get(entryId);

  if (!entry) {
    return {};
  }

  const database = DatabasesStore.get(entry.database);

  if (!database) {
    return {};
  }

  // Start with the entry's raw property values
  const values: Record<string, PropertyValue> = {
    Title: entry.title,
    ...entry.properties,
  };

  // Create virtual views for collection properties
  const virtualViewIds = createEntryVirtualViews(entryId, design, propertyMap);

  // Transform property values to their display versions
  for (const property of database.properties) {
    const value = values[property.name];

    // Replace image file names with full file paths
    if (property.type === 'image' && typeof value === 'string') {
      values[property.name] = getPropertyFilePath(
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
