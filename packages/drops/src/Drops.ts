import { DropsApi } from './types';
import { get } from './get';
import { getAllDrops } from './getAllDrops';
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

export const Drops: DropsApi = {
  get,
  getAll: getAllDrops,
  create: createDrop,
  update: updateDrop,
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
  clear: clearDrops,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
