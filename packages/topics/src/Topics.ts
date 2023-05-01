import { clearTopics } from './clearTopics';
import { createTopic } from './createTopic';
import { getTopic } from './getTopic';
import { getTopics } from './getTopics';
import { loadTopics } from './loadTopics';
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

export const Topics: TopicsApi = {
  load: loadTopics,
  clear: clearTopics,
  create: createTopic,
  get,
};
