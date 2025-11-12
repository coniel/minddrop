export interface DatabasesConfig {
  /**
   * The user's database paths.
   */
  paths: DatabasePathsConfig[];
}

export interface DatabasePathsConfig {
  /**
   * The name of the database.
   */
  name: string;

  /**
   * The path to the database directory.
   */
  path: string;
}
