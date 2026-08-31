import { i18n } from '@minddrop/i18n';
import {
  METADATA_PROPERTY_TYPES,
  MetadataPropertySchemas,
  SORTABLE_PROPERTY_TYPES,
} from '@minddrop/properties';
import { Database } from '../../types';
import { EntrySortOptions } from '../sortDatabaseEntries';

export interface SortableEntryProperty {
  /**
   * Identifies the sortable property among the others.
   */
  id: string;

  /**
   * The name under which the sortable property is displayed.
   */
  label: string;

  /**
   * The sortable property's stringified content icon.
   */
  icon?: string;

  /**
   * Whether sorting by the property reads an entry property or
   * the entry's metadata.
   */
  by: Required<EntrySortOptions>['by'];

  /**
   * The metadata type or property name the entries are sorted by.
   */
  property: string;
}

/**
 * Lists the properties a set of databases' entries can be sorted
 * by. The entry metadata properties are always listed, named after
 * the matching database property when every database declares one
 * under the same name.
 *
 * Only properties every database declares under the same name and
 * type are listed, as a property some of the entries do not have
 * cannot order them all.
 *
 * @param databases - The databases the entries belong to.
 * @returns The properties the entries can be sorted by.
 */
export function resolveSortableEntryProperties(
  databases: Database[],
): SortableEntryProperty[] {
  // Metadata properties are sortable whether or not the databases
  // declare them as properties of their own
  const metadataProperties = MetadataPropertySchemas.map(
    (schema): SortableEntryProperty => {
      // The databases' own properties of the metadata type
      const declared = databases.map((database) =>
        database.properties.find((property) => property.type === schema.type),
      );

      // A declared property only names the metadata when every
      // database declares one under the same name
      const named = declared.every(
        (property) => property?.name === declared[0]?.name,
      )
        ? declared[0]
        : undefined;

      return {
        id: `metadata:${schema.type}`,
        label: named ? named.name : i18n.t(schema.name),
        icon: named ? named.icon : schema.icon,
        by: 'metadata',
        property: schema.type,
      };
    },
  );

  // The first database's properties stand in for the shared ones,
  // which the remaining databases are checked against
  const [firstDatabase, ...otherDatabases] = databases;

  const properties = (firstDatabase?.properties ?? [])
    .filter((property) => {
      // Metadata backed properties are sorted by as metadata
      if (METADATA_PROPERTY_TYPES.has(property.type)) {
        return false;
      }

      // Properties whose values have no order cannot be sorted by
      if (!SORTABLE_PROPERTY_TYPES.has(property.type)) {
        return false;
      }

      // Properties missing from any of the databases cannot order
      // all of the entries
      return otherDatabases.every((database) =>
        database.properties.some(
          (candidate) =>
            candidate.name === property.name &&
            candidate.type === property.type,
        ),
      );
    })
    .map(
      (property): SortableEntryProperty => ({
        id: `property:${property.name}`,
        label: property.name,
        icon: property.icon,
        by: 'property',
        property: property.name,
      }),
    );

  return [...metadataProperties, ...properties];
}
