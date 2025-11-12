import { coreDataTypes } from '../data-type-configs';
import { registerDataType } from '../registerDataType';

/**
 * Registers all core data types into the DataTypesStore.
 */
export function initializeDataTypes() {
  // Register core data types
  coreDataTypes.forEach((dataType) => {
    registerDataType(dataType);
  });
}
