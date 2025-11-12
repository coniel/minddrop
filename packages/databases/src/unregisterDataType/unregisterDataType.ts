import { Events } from '@minddrop/events';
import { DataTypesStore } from '../DataTypesStore';
import { getDataType } from '../getDataType';

/**
 * Unregisters a data type.
 *
 * @param type - The type of the data type to unregister.
 *
 * @throws {DataTypeNotFoundError} Thrown if the data type does not exist.
 *
 * @dispatches data-types:data-type:unregister
 */
export function unregisterDataType(type: string): void {
  // Retrieve the data type config
  const config = getDataType(type);

  // Remove the data type from the store
  DataTypesStore.remove(type);

  // Dispatch a data type unregister event
  Events.dispatch('data-types:data-type:unregister', config);
}
