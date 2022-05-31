import { Resources } from '@minddrop/resources';
import { RegisteredTopicViewConfig } from './types';

export const TopicViewConfigsStore =
  Resources.createConfigsStore<RegisteredTopicViewConfig>({
    idField: 'id',
  });
