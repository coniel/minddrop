import { Core } from '@minddrop/core';
import { Topic } from './Topic.types';
import { TopicContent } from './TopicContent.types';

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
   * Returns all topics contained by the specified directory.
   *
   * @param paths - The path to the directory containing the topics.
   * @param recursive - When `true`, traverses subdirectories to get subtopics.
   * @returns The contained topics.
   */
  getFrom(path: string, recursive?: boolean): Promise<Topic[]>;

  /**
   * Returns the text content of the topic at the given path,
   * or null if the topic is a directory with no associated text
   * file.
   *
   * @param path - The topic's absolute path.
   * @reurns The topic file's text content or null if the topic has no file.
   *
   * @throws FileNoFoundError
   * Thrown if the topic file/dir does not exist.
   */
  read(path: string): Promise<string | null>;

  /**
   * Returns the text content of the topic at the given path,
   * or null if the topic is a directory with no associated text
   * file.
   *
   * @param path - The topic's absolute path.
   * @reurns The topic file's text content or null if the topic has no file.
   *
   * @throws FileNoFoundError
   * Thrown if the topic file/dir does not exist.
   */
  parse(markdown: string): TopicContent;

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
   * Updates a topic in the topic's store and dispatches a
   * 'topics:topic:update' event.
   *
   * @param path - The topic path.
   * @param data - The data to st on the topic.
   * @returns The updated topic.
   *
   * @throws NotFoundError
   * Thrown if the topic does not exist.
   */
  update(path: string, data: Partial<Topic>): Topic;

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
   * Converts a topic's content into markdown.
   *
   * @property content - The topic's content.
   * @returns The topic content as markdown.
   */
  toMarkdown(content: TopicContent): string;

  /**
   * Writes the provided markdown to a topic's markdown file.
   *
   * @param path - The topic path.
   * @param markdown - The topic markdown.
   */
  write(path: string, markdown: string): Promise<void>;

  /**
   * Returns the path to a topic's markdown file. Does **not**
   * check for the existence of the file.
   *
   * @param path - The topic path.
   * @returns The path to the topic's markdown file.
   */
  getMarkdownFilePath(topicPath: string): string;

  /**
   * Clears all topics from the topics store.
   */
  clear(): void;
}
