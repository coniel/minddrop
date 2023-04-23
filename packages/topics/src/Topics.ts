import { clearTopics } from './clearTopics';
import { loadTopics } from './loadTopics';
import { TopicsApi } from './types/TopicsApi.types';

export const Topics: TopicsApi = {
  load: loadTopics,
  clear: clearTopics,
};
