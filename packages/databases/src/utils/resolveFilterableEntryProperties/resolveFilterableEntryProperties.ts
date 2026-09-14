import { Filters } from '@minddrop/filters';
import { PropertiesSchema } from '@minddrop/properties';
import { Database } from '../../types';
import { withImplicitMetadataProperties } from '../withImplicitMetadataProperties';

/**
 * Lists the properties a set of databases' entries can be filtered
 * by: the entry metadata properties, and the properties every
 * database declares under the same name and type. Properties of
 * a type with no comparison operators are left out.
 *
 * @param databases - The databases the entries belong to.
 * @returns The properties the entries can be filtered by.
 */
export function resolveFilterableEntryProperties(
  databases: Database[],
): PropertiesSchema {
  // Take the first database's properties as the candidates, to
  // check against the remaining databases.
  const [firstDatabase, ...otherDatabases] = databases;

  // Keep the candidates every database declares
  const shared = (firstDatabase?.properties ?? []).filter((property) => {
    // Drop types with no operators
    if (Filters.constants.OperatorsByPropertyType[property.type].length === 0) {
      return false;
    }

    // Check that every other database declares the property under
    // the same name and type.
    return otherDatabases.every((database) =>
      database.properties.some(
        (candidate) =>
          candidate.name === property.name && candidate.type === property.type,
      ),
    );
  });

  // Prepend the implicit metadata properties
  return withImplicitMetadataProperties(shared);
}
