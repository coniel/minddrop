import { Database } from './Database.types';

export type DatabaseTemplate = Omit<
  Database,
  'id' | 'path' | 'created' | 'lastModified' | 'designs'
>;
