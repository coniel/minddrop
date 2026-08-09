import {
  Database,
  EntrySort,
  withImplicitTitleProperty,
} from '@minddrop/databases';
import { QuerySort } from '../../types';

/**
 * Converts query sort instructions into SQL entry sorts,
 * resolving property types against the database schema. Sorts
 * on properties missing from the schema are dropped.
 *
 * @param sort - The query sort instructions to convert.
 * @param database - The database the query runs against.
 *
 * @returns The entry sort instructions.
 */
export function convertQuerySortToEntrySort(
  sort: QuerySort[],
  database: Database,
): EntrySort[] {
  // Resolve sort properties against the schema including the
  // implicit title property
  const schema = withImplicitTitleProperty(database.properties);

  return sort.flatMap((sortEntry) => {
    // Drop sorts on properties missing from the schema
    const property = schema.find(
      (propertySchema) => propertySchema.name === sortEntry.property,
    );

    if (!property) {
      return [];
    }

    return [
      {
        property: sortEntry.property,
        propertyType: property.type,
        direction: sortEntry.direction,
      },
    ];
  });
}
