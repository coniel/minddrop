import { ViewInstance, ViewInstanceTypeData } from '@minddrop/views';

export interface BaseTopicViewInstanceData {
  /**
   * The ID of the topic.
   */
  topic: string;
}

export type TopicViewInstance<TData extends ViewInstanceTypeData = {}> =
  ViewInstance<BaseTopicViewInstanceData & TData>;

export interface BaseCreateTopicViewInstanceData {
  /**
   * The ID of the topic.
   */
  topic: string;
}

export type TopicViewInstanceData<TTypeData extends ViewInstanceTypeData = {}> =
  BaseTopicViewInstanceData & TTypeData;
