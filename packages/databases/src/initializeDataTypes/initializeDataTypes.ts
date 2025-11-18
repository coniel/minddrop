import { i18n } from '@minddrop/i18n';
import { coreDataTypes } from '../data-type-configs';
import { registerDataType } from '../registerDataType';

/**
 * Registers all core data types into the DataTypesStore.
 */
export function initializeDataTypes() {
  // Register core data types
  coreDataTypes.forEach((dataType) => {
    // Translate data type names and descriptions
    registerDataType({
      ...dataType,
      name: i18n.t(dataType.name),
      description: i18n.t(dataType.description),
      properties: dataType.properties.map((property) => {
        return {
          ...property,
          name: i18n.t(property.name),
          description: property.description
            ? i18n.t(property.description)
            : undefined,
        };
      }),
    });
  });
}
