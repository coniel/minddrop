import { i18n } from '@minddrop/i18n';
import {
  MetadataPropertySchemas,
  PropertiesSchema,
  PropertySchema,
} from '@minddrop/properties';

/**
 * Returns the properties schema with the implicit entry metadata
 * properties prepended, omitting any whose type the schema
 * already declares.
 *
 * @param properties - The database properties schema.
 * @returns The schema including the implicit metadata properties.
 */
export function withImplicitMetadataProperties(
  properties: PropertiesSchema,
): PropertiesSchema {
  // Metadata property types the schema does not declare itself
  const missingSchemas = MetadataPropertySchemas.filter(
    (schema) => !properties.some((property) => property.type === schema.type),
  );

  if (!missingSchemas.length) {
    return properties;
  }

  // Stand-ins for the entry metadata, which is not part of the
  // database properties schema but is a valid mapping target.
  // Built at call time so the names resolve against the active
  // locale.
  const implicitProperties = missingSchemas.map(
    (schema): PropertySchema => ({ ...schema, name: i18n.t(schema.name) }),
  );

  return [...implicitProperties, ...properties];
}
