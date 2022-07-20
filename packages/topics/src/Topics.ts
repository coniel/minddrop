import { mapById } from '@minddrop/utils';
import { TopicsApi } from './types';
import { addSubtopics } from './addSubtopics';
import { removeSubtopics } from './removeSubtopics';
import { addDropsToTopic } from './addDropsToTopic';
import { removeDropsFromTopic } from './removeDropsFromTopic';
import { addTagsToTopic } from './addTagsToTopic';
import { removeTagsFromTopic } from './removeTagsFromTopic';
import { registerTopicView } from './registerTopicView';
import { unregisterTopicView } from './unregisterTopicView';
import { createTopicViewInstance } from './createTopicViewInstance';
import { deleteTopicViewInstance } from './deleteTopicViewInstance';
import { moveDropsToTopic } from './moveDropsToTopic';
import { archiveDropsInTopic } from './archiveDropsInTopic';
import { unarchiveDropsInTopic } from './unarchiveDropsInTopic';
import { archiveSubtopics } from './archiveSubtopics';
import { unarchiveSubtopics } from './unarchiveSubtopics';
import { moveSubtopics } from './moveSubtopics';
import { TopicsResource } from './TopicsResource';
import { TopicViewConfigsStore } from './TopicViewConfigsStore';
import { getTopicViewConfig } from './getTopicViewConfig';

export const Topics: TopicsApi = {
  get: TopicsResource.get,
  getAll: TopicsResource.getAll,
  filter: TopicsResource.filter,
  create: TopicsResource.create,
  update: TopicsResource.update,
  delete: TopicsResource.delete,
  restore: TopicsResource.restore,
  deletePermanently: TopicsResource.deletePermanently,
  normalize: TopicsResource.normalize,
  addParents: TopicsResource.addParents,
  removeParents: TopicsResource.removeParents,
  addSubtopics,
  removeSubtopics,
  moveSubtopics,
  archiveSubtopics,
  unarchiveSubtopics,
  addDrops: addDropsToTopic,
  removeDrops: removeDropsFromTopic,
  moveDrops: moveDropsToTopic,
  archiveDrops: archiveDropsInTopic,
  unarchiveDrops: unarchiveDropsInTopic,
  addTags: addTagsToTopic,
  removeTags: removeTagsFromTopic,
  getViewConfig: getTopicViewConfig,
  getAllViewConfigs: () => mapById(TopicViewConfigsStore.getAll()),
  registerView: registerTopicView,
  unregisterView: unregisterTopicView,
  createViewInstance: createTopicViewInstance,
  deleteViewInstance: deleteTopicViewInstance,
  store: TopicsResource.store,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};

/**
 * Returns a topic by ID, or `null` if it
 * does not exist.
 *
 * @param topicId - The ID of the topic to retrieve.
 * @returns A topic or `null`.
 */
export const useTopic = (topicId: string) =>
  TopicsResource.hooks.useDocument(topicId);

/**
 * Returns a `{ [id]: Topic }` map of topics by ID,
 * omitting any topics which do not exist.
 *
 * @param topicIds - The IDs of the topics to retrieve.
 * @returns A `{ [id]: Topic }` map of the requested topics.
 */
export const useTopics = (topicIds: string[]) =>
  TopicsResource.hooks.useDocuments(topicIds);
