import {
  METADATA_PROPERTY_TYPES,
  PropertiesSchema,
} from '@minddrop/properties';
import { Database } from '../../types';
import { withImplicitMetadataProperties } from '../withImplicitMetadataProperties';

/**
 * Resolves the database property each of a design's properties
 * renders. Metadata design properties (title, created, last
 * modified) without an explicit mapping fall back to the database
 * property of the same type.
 *
 * @param designProperties - The design's properties schema.
 * @param database - The database the design renders.
 * @returns A map of design property names to database property names.
 */
export function resolveDesignPropertyMap(
  designProperties: PropertiesSchema,
  database: Database,
): Record<string, string> {
  const databaseProperties = withImplicitMetadataProperties(
    database.properties,
  );
  const map: Record<string, string> = {};

  for (const designProperty of designProperties) {
    const explicitMapping = database.designPropertyMap[designProperty.name];

    // Explicit mappings take precedence over the auto-mapping
    if (explicitMapping) {
      map[designProperty.name] = explicitMapping;
      continue;
    }

    // Only metadata properties are auto-mapped
    if (!METADATA_PROPERTY_TYPES.has(designProperty.type)) {
      continue;
    }

    // Auto-map to the database property of the same metadata type
    const metadataProperty = databaseProperties.find(
      (property) => property.type === designProperty.type,
    );

    if (metadataProperty) {
      map[designProperty.name] = metadataProperty.name;
    }
  }

  return map;
}
