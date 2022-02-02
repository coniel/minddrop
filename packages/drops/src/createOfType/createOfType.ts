import { Core, DataInsert } from '@minddrop/core';
import { Drop } from '../types';
import { getDropTypeConfig } from '../getDropTypeConfig';

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

  return config.create(core, data);
}
