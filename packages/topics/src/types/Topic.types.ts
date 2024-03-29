import { TopicContent } from './TopicContent.types';

export interface Topic {
  /**
   * The topic title, also serves as the filen/directory name.
   */
  title: string;

  /**
   * Absolute path to the topic markdown file.
   */
  path: string;

  /**
   * `true` if the topic is a directory.
   */
  isDir: boolean;

  /**
   * The paths of the topic's subtopics.
   */
  subtopics: string[];

  /**
   * The topic's content. Only present on topics opened during
   * the current session.
   */
  content?: TopicContent;
}
