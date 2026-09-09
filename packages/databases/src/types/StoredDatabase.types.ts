import { Database } from './Database.types';

/**
 * A database as stored in its config file: without the fields derived
 * from the directory it sits in.
 */
export type StoredDatabase = Omit<Database, 'path' | 'name'>;
