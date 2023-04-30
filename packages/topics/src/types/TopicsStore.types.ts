import { Topic } from './Topic.types';

export interface TopicStore {
  /**
   * Root level topics.
   */
  topics: Topic[];

  /*
   * Load topics into the store.
   *
   * @param topics - The topics to load.
   */
  load(topics: Topic[]): void;

  /**
   * Add a topic to the store.
   *
   * @param topic - The topic to add.
   */
  add(topic: Topic): void;

  /**
   * Remove a topic from the store.
   *
   * @parm path - The path of the topic to remove.
   */
  remove(path: string): void;

  /**
   * Update data on the topic with the specified path.
   *
   * @parm path - The path of the topic to update.
   * @param data - The updated data applied to the topic.
   */
  update(path: string, data: Partial<Topic>): void;

  /**
   * Clear root topics.
   */
  clear(): void;
}
