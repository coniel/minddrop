import { DropsApi, DropTypeData } from './types';
import { createFromDataInsert } from './createFromDataInsert';
import { duplicateDrops } from './duplicateDrops';
import { DropsResource } from './DropsResource';

export const Drops: DropsApi = {
  ...DropsResource,
  createFromDataInsert,
  duplicate: duplicateDrops,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};

/**
 * Returns a drop by ID or `null` if the
 * drop does not exist.
 *
 * @param dropId - The ID of the drop to retrieve.
 * @returns A drop or `null` if it does not exist.
 */
export const useDrop = <TTypeData extends DropTypeData = {}>(dropId: string) =>
  DropsResource.hooks.useDocument<TTypeData>(dropId);

/**
 * Returns a `{ [id]: Drop }` drops by ID,
 * omitting any drops that do not exist.
 *
 * @param dropIds - The IDs of the drops to retrieve.
 * @returns A `{ [id]: Drop }` maps of the requested drops.
 */
export const useDrops = <TTypeData extends DropTypeData = {}>(
  dropIds: string[],
) => DropsResource.hooks.useDocuments<TTypeData>(dropIds);
