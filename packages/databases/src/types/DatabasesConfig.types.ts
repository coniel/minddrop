export interface DatabasesConfig {
  /**
   * The user's database paths.
   */
  paths: DatabasePathsConfig[];
}

export interface DatabasePathsConfig {
  /**
   * The database ID.
   */
  id: string;

  /**
   * The path to the database directory.
   */
  path: string;
}
