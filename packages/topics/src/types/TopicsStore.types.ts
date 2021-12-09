import { Topic, TopicChanges } from './Topic.types';

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
   * Adds a topic to the store.
   *
   * @param topic The topic to add.
   */
  addTopic(topic: Topic): void;

  /**
   * Updates a topic in the store.
   *
   * @param id The ID of the topic to update.
   * @param data The data to set on the topic.
   */
  updateTopic(id: string, data: TopicChanges): void;

  /**
   * Removes a topic from the store.
   *
   * @param id The ID of the topic to remove.
   */
  removeTopic(id: string): void;
}
