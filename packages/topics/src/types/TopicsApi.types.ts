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
   * Clears all topics from the topics store.
   */
  clear(): void;
}
