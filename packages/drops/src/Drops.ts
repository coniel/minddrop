import { DropsApi } from './types';
import { get } from './get';
import { getAllDrops } from './getAllDrops';
import { filterDrops } from './filterDrops';
import { registerDropType } from './registerDropType';
import { unregisterDropType } from './unregisterDropType';
import { createDrop } from './createDrop';
import { updateDrop } from './updateDrop';
import { archiveDrop } from './archiveDrop';
import { deleteDrop } from './deleteDrop';
import { restoreDrop } from './restoreDrop';
import { deleteDropPermanently } from './deleteDropPermanently';
import { addTagsToDrop } from './addTagsToDrop';
import { removeTagsFromDrop } from './removeTagsFromDrop';
import { addFilesToDrop } from './addFilesToDrop';
import { removeFilesFromDrop } from './removeFilesFromDrop';
import { replaceDropFiles } from './replaceDropFiles';
import { loadDrops } from './loadDrops';
import { clearDrops } from './clearDrops';
import { getRegisteredDropTypes } from './getRegisteredDropTypes';
import { clearRegisteredDropTypes } from './clearRegisteredDropTypes';
import { createOfType } from './createOfType';
import { createFromDataInsert } from './createFromDataInsert';
import { insertData } from './insertData';
import { renderDrop } from './renderDrop';

export const Drops: DropsApi = {
  get,
  getAll: getAllDrops,
  filter: filterDrops,
  register: registerDropType,
  unregister: unregisterDropType,
  create: createDrop,
  createOfType,
  createFromDataInsert,
  update: updateDrop,
  insertData,
  archive: archiveDrop,
  delete: deleteDrop,
  restore: restoreDrop,
  addTags: addTagsToDrop,
  removeTags: removeTagsFromDrop,
  addFiles: addFilesToDrop,
  removeFiles: removeFilesFromDrop,
  replaceFiles: replaceDropFiles,
  deletePermanently: deleteDropPermanently,
  load: loadDrops,
  clearDrops,
  clearRegisteredDropTypes,
  getRegisteredDropTypes,
  render: renderDrop,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
