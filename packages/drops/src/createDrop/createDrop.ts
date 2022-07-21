import { Core } from '@minddrop/core';
import { Drop, BaseCreateDropData, DropTypeData } from '../types';
import { DropsResource } from '../DropsResource';

/**
 * Creates a new drop and dispatches a `drops:drop:create` event.
 *
 * @param core - A MindDrop core instance.
 * @param type - The type of drop to create.
 * @param data - The default drop property values.
 * @returns The newly created drop.
 *
 * @throws ResourceTypeNotRegisteredError
 * Thrown if the drop type is not registered.
 *
 * @throws ResourceValidationError
 * Thrown if the drop data is invalid.
 */
export function createDrop<
  TTypeCreateData = {},
  TTypeData extends DropTypeData = {},
>(
  core: Core,
  type: string,
  data?: BaseCreateDropData & TTypeCreateData,
): Drop<TTypeData> {
  // Get drop type config
  const config = DropsResource.getTypeConfig(type);

  let createData: BaseCreateDropData & TTypeCreateData;

  if (config.initializeData) {
    // Initialize drop data
    createData = config.initializeData(core) as TTypeCreateData;
  }

  if (data) {
    // Merge in porivded data
    createData = { ...createData, ...data };
  }

  // Create drop
  const drop = DropsResource.create<TTypeCreateData, TTypeData>(
    core,
    type,
    createData,
  );

  return drop;
}
