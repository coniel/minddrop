import { clearTopics } from './clearTopics';
import { createTopic } from './createTopic';
import { getTopic } from './getTopic';
import { getTopics } from './getTopics';
import { getTopicsFromPath } from './getTopicsFromPath';
import { loadTopics } from './loadTopics';
import { readTopic } from './readTopic';
import { renameTopic } from './renameTopic';
import { Topic } from './types';
import { TopicsApi } from './types/TopicsApi.types';

// The `get` function which returns one or multiple topics based
// on whether the `path` argument is a string or an array.
function get(path: string): Topic;
function get(paths: string[]): Topic[];
function get(path: string | string[]) {
  if (Array.isArray(path)) {
    return getTopics(path);
  }

  return getTopic(path);
}

function getFrom(path: string, recursive = false) {
  return getTopicsFromPath(path, recursive);
}

export const Topics: TopicsApi = {
  get,
  load: loadTopics,
  clear: clearTopics,
  create: createTopic,
  rename: renameTopic,
  getFrom,
  read: readTopic,
};
