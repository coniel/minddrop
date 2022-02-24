import { TopicsApi } from './types';
import { get } from './get';
import { getAllTopics } from './getAllTopics';
import { getTopicParents } from './getTopicParents';
import { getDropParents } from './getDropParents';
import { filterTopics } from './filterTopics';
import { createTopic } from './createTopic';
import { updateTopic } from './updateTopic';
import { addSubtopics } from './addSubtopics';
import { removeSubtopics } from './removeSubtopics';
import { addDropsToTopic } from './addDropsToTopic';
import { removeDropsFromTopic } from './removeDropsFromTopic';
import { addTagsToTopic } from './addTagsToTopic';
import { removeTagsFromTopic } from './removeTagsFromTopic';
import { deleteTopic } from './deleteTopic';
import { restoreTopic } from './restoreTopic';
import { deleteTopicPermanently } from './deleteTopicPermanently';
import { loadTopics } from './loadTopics';
import { clearTopics } from './clearTopics';
import { registerTopicView } from './registerTopicView';
import { unregisterTopicView } from './unregisterTopicView';
import { getTopicView } from './getTopicView';
import { getTopicViews } from './getTopicViews';
import { createTopicViewInstance } from './createTopicViewInstance';
import { deleteTopicViewInstance } from './deleteTopicViewInstance';
import { moveDropsToTopic } from './moveDropsToTopic';
import { archiveDropsInTopic } from './archiveDropsInTopic';
import { unarchiveDropsInTopic } from './unarchiveDropsInTopic';

export const Topics: TopicsApi = {
  get,
  getAll: getAllTopics,
  parents: getTopicParents,
  dropParents: getDropParents,
  filter: filterTopics,
  create: createTopic,
  update: updateTopic,
  addSubtopics,
  removeSubtopics,
  addDrops: addDropsToTopic,
  moveDrops: moveDropsToTopic,
  archiveDrops: archiveDropsInTopic,
  unarchiveDrops: unarchiveDropsInTopic,
  removeDrops: removeDropsFromTopic,
  addTags: addTagsToTopic,
  removeTags: removeTagsFromTopic,
  delete: deleteTopic,
  restore: restoreTopic,
  deletePermanently: deleteTopicPermanently,
  getView: getTopicView,
  getViews: getTopicViews,
  registerView: registerTopicView,
  unregisterView: unregisterTopicView,
  createViewInstance: createTopicViewInstance,
  deleteViewInstance: deleteTopicViewInstance,
  load: loadTopics,
  clear: clearTopics,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
