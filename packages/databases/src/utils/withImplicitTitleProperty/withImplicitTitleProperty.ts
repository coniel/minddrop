import { i18n } from '@minddrop/i18n';
import { PropertiesSchema, PropertySchema } from '@minddrop/properties';

/**
 * Returns the properties schema with the implicit entry Title
 * property prepended, unless the schema already declares a title
 * property.
 *
 * @param properties - The database properties schema.
 * @returns The schema including a title property.
 */
export function withImplicitTitleProperty(
  properties: PropertiesSchema,
): PropertiesSchema {
  // Whether the schema already declares a title property
  const hasTitleProperty = properties.some(
    (property) => property.type === 'title',
  );

  if (hasTitleProperty) {
    return properties;
  }

  // Stand-in for the entry title, which is not part of the
  // database properties schema but is a valid mapping target.
  // Built at call time so the name resolves against the active
  // locale.
  const implicitTitleProperty: PropertySchema = {
    type: 'title',
    name: i18n.t('properties.title.name'),
  };

  return [implicitTitleProperty, ...properties];
}
