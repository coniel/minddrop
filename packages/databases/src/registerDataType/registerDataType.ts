import { Events } from '@minddrop/events';
import { DataTypesStore } from '../DataTypesStore';
import { getDataType } from '../getDataType';
import { DataType } from '../types';

/**
 * Registers a new data type.
 *
 * @param type - The data type to register.
 *
 * @dispatches data-types:data-type:register
 */
export function registerDataType(type: DataType): void {
  // Check if a data type with the same type already exists
  const existingType = getDataType(type.type, false);

  if (existingType) {
    // If it exists, remove it to allow overwriting
    DataTypesStore.remove(type.type);
  }

  // Add the data type to the store
  DataTypesStore.add(type);

  // Dispatch a data type register event
  Events.dispatch('data-types:data-type:register', type);
}
