import { DropsApi } from './types';
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
