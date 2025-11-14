import { Database } from './Database.types';

export type DatabaseTemplate = Omit<Database, 'path' | 'created'>;
