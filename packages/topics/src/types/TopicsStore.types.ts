import { Topic } from './Topic.types';
import { TopicView } from './TopicView.types';

export interface TopicsStore {
  /**
   * The topics, stored as a `{ [topicId]: Topic }` map.
   */
  topics: Record<string, Topic>;

  /**
   * Registered topic views, stored as a `{ [viewId]: TopicView }` map.
   */
  views: Record<string, TopicView>;

  /**
   * Bulk inserts an array of topics into the store.
   *
   * @param topics The topics to add to the store.
   */
  loadTopics(topics: Topic[]): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;

  /**
   * Sets a topic in the store.
   *
   * @param topic The topic to set.
   */
  setTopic(topic: Topic): void;

  /**
   * Removes a topic from the store.
   *
   * @param id The ID of the topic to remove.
   */
  removeTopic(id: string): void;

  /**
   * Sets a view in the registered views.
   *
   * @param view The view to set.
   */
  setView(view: TopicView): void;

  /**
   * Removes a view from the registered views.
   *
   * @param id The ID of the view to remove.
   */
  removeView(id: string): void;
}
