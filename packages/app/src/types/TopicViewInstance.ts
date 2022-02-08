import { CreateViewInstanceData, ViewInstance } from '@minddrop/views';

export interface TopicViewInstance extends ViewInstance {
  /**
   * The ID of the topic.
   */
  topicId: string;
}

export interface CreateTopicViewInstanceData extends CreateViewInstanceData {
  /**
   * The ID of the topic.
   */
  topicId: string;
}
