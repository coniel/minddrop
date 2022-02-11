import { CreateViewInstanceData, ViewInstance } from '@minddrop/views';

export interface TopicViewInstance extends ViewInstance {
  /**
   * The ID of the topic.
   */
  topic: string;
}

export interface CreateTopicViewInstanceData extends CreateViewInstanceData {
  /**
   * The ID of the topic.
   */
  topic: string;
}
