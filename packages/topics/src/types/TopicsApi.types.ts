import { Core } from '@minddrop/core';
import { Topic } from './Topic.types';

export interface TopicsApi {
  /**
   * Reads topics from a directory and loads them
   * into the topics store. Dispatches a 'topics:load'
   * event.
   *
   * @param core - A MindDrop core instance.
   * @param path - The path from which to load the topics.
   */
  load(core: Core, path: string): Promise<void>;

  /**
   * Returns a topic or subtopic by path.
   *
   * @param path - The topic/subtopic path.
   * @returns The requested topic or `null` if it does not exist.
   */
  get(path: string): Topic | null;

  /**
   * Returns topics at the specified paths, omitting any
   * missing topics.
   *
   * @param paths - The topic paths.
   * @returns The requested topics.
   */
  get(paths: string[]): Topic[];

  /**
   * Creates a topic at the specified path and dispatches a
   * 'topics:topic:create' event.
   *
   * @param core - A MindDrop core instance.
   * @param path - The path at which to create the topic.
   * @param asDir - When `true`, the topic will be created as a directory.
   * @returns The created topic.
   */
  create(core: Core, path: string, asDir?: boolean): Promise<Topic>;

  /**
   * Renames a topic markdown file (as well as directory
   * if the topic is a directory), and updates the
   * markdown heading (if present) to match.
   *
   * Uses incremental file naming to avoid collisions.
   *
   * @param core - A MindDrop core instance.
   * @param path - The topic path.
   * @param name - The new topic name/title.
   * @returns The new topic path.
   */
  rename(core: Core, path: string, name: string): Promise<string>;

  /**
   * Clears all topics from the topics store.
   */
  clear(): void;
}
