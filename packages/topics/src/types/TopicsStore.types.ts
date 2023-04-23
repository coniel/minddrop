import { Topic } from './Topic.types';

export interface TopicStore {
  /**
   * Root level topics.
   */
  topics: Record<string, Topic>;

  /*
   * Load root level topics.
   *
   * @param topics - The topics to load.
   */
  load(topics: Record<string, Topic>): void;

  /**
   * Add a topic to the specified path.
   *
   * @param path - The path at which to add the topic.
   * @param topic - The topic to add.
   */
  add(path: string[], topic: Topic): void;

  /**
   * Remove a topic from the specified path.
   *
   * @parm path - The path from which to remove the topic.
   */
  remove(path: string[]): void;

  /**
   * Update data on the topic at the specified path.
   *
   * @parm path - The path of the topic to update.
   * @param data - The updated data applied to the topic.
   */
  update(path: string[], data: Partial<Topic>): void;

  /**
   * Clear root topics.
   */
  clear(): void;
}
