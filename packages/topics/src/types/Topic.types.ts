export interface Topic {
  /**
   * The topic name, also used as file and directory name.
   */
  name: string;

  /**
   * `true` if the topic is a directory.
   */
  isDir: boolean;

  /**
   * A `{ [file/dir name]: Topic }` map of the topic's subtopics.
   */
  subtopics: Record<string, Topic>;
}
