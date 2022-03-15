import { Core, DataInsert } from '@minddrop/core';
import { Drop } from '../types';
import { getDropTypeConfig } from '../getDropTypeConfig';
import { createDrop } from '../createDrop';

/**
 * Creates a drop of the specified type and dispatches
 * a `drops:create` event.
 *
 * @param core A MindDrop core instance.
 * @param type The type of drop to create.
 * @param data The data from which to create the drop.
 * @returns A promise which resolves to the new drop.
 */
export async function createOfType(
  core: Core,
  type: string,
  data?: DataInsert,
): Promise<Drop> {
  const config = getDropTypeConfig(type);

  // Create the drop data using the drop config's create method
  const dropData = await config.create(core, data);

  // Create a drop using the data
  const drop = createDrop(core, dropData);

  return drop;
}
