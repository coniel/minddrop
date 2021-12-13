import { Topic } from './Topic.types';

export interface TopicsStore {
  /**
   * The topics, stored as a `{ [topicId]: Topic }` map.
   */
  topics: Record<string, Topic>;

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
}
