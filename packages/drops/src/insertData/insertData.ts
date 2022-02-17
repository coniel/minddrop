import { Core, DataInsert } from '@minddrop/core';
import { getRegisteredDropTypes } from '../getRegisteredDropTypes';
import { DropTypeNotRegisteredError } from '../errors';
import { get } from '../get';
import { Drop } from '../types';

/**
 * Inserts data into a drop.
 * Does nothing if the drop type is not configured to accept
 * data inserts. Returns a promise which resolves to the updated
 * drop (or original drop if it was not updated).
 *
 * If the drop is updated as a result of the insert, dispatches a
 * `drops:update` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop into which to insert the data.
 * @param data The data to be inserted into the drop.
 * @returns A promise resolving to the updated drop.
 */
export async function insertData(
  core: Core,
  dropId: string,
  data: DataInsert,
): Promise<Drop> {
  const drop = get(dropId);
  const [config] = getRegisteredDropTypes({ type: [drop.type] });

  if (!config) {
    throw new DropTypeNotRegisteredError(drop.type);
  }

  if (config.insertData) {
    return config.insertData(core, drop, data);
  }

  return drop;
}
