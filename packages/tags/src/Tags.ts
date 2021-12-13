import { TagsApi } from './types';
import { get } from './get';
import { getAllTags } from './getAllTags';
import { createTag } from './createTag';
import { updateTag } from './updateTag';
import { deleteTag } from './deleteTag';
import { loadTags } from './loadTags';
import { clearTags } from './clearTags';

export const Tags: TagsApi = {
  get,
  getAll: getAllTags,
  create: createTag,
  update: updateTag,
  delete: deleteTag,
  load: loadTags,
  clear: clearTags,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
