import { TopicsApi } from './types';
import { get } from './get';
import { getAllTopics } from './getAllTopics';
import { getTopicParents } from './getTopicParents';
import { createTopic } from './createTopic';
import { updateTopic } from './updateTopic';
import { addSubtopics } from './addSubtopics';
import { removeSubtopics } from './removeSubtopics';
import { archiveTopic } from './archiveTopic';
import { deleteTopic } from './deleteTopic';
import { restoreTopic } from './restoreTopic';
import { deleteTopicPermanently } from './deleteTopicPermanently';
import { insertData } from './insertData';
import { loadTopics } from './loadTopics';
import { clearTopics } from './clearTopics';

export const Topics: TopicsApi = {
  get,
  getAll: getAllTopics,
  parents: getTopicParents,
  create: createTopic,
  update: updateTopic,
  addSubtopics,
  removeSubtopics,
  archive: archiveTopic,
  delete: deleteTopic,
  restore: restoreTopic,
  deletePermanently: deleteTopicPermanently,
  insertData,
  load: loadTopics,
  clear: clearTopics,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
