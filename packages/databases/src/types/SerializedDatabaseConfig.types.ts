import { Database } from './Database.types';

export interface SerializedDatabaseConfig
  extends Omit<Database, 'path' | 'created'> {
  /**
   * The database creation date as an ISO string.
   */
  created: string;
}
