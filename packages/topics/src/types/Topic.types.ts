export interface Topic {
  /**
   * The title.
   */
  title: string;

  /**
   * The file or directory name.
   */
  filename: string;

  /**
   * true if the topic is a directory.
   */
  isDir: boolean;

  /**
   * A `{ [file/dir name]: Topic }` map of the topic's subtopics.
   */
  subtopics: Record<string, Topic>;
}
