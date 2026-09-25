import { EmbeddableFilePropertyTypes } from '../../constants';
import {
  EmbeddableFilePropertySchema,
  EmbeddableFilePropertyType,
  PropertySchema,
} from '../../types';

/**
 * Checks whether a property holds a file which can be shown in
 * place.
 *
 * @param property - The property schema.
 * @returns Whether the property is embeddable.
 */
export function isEmbeddableFileProperty(
  property: PropertySchema,
): property is EmbeddableFilePropertySchema {
  return EmbeddableFilePropertyTypes.includes(
    property.type as EmbeddableFilePropertyType,
  );
}
