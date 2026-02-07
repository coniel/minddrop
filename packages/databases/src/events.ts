import { Database, DatabaseEntry } from './types';

// Database events
export const DatabaseCreatedEvent = 'databases:database:created';
export const DatabaseUpdatedEvent = 'databases:database:updated';
export const DatabaseDeletedEvent = 'databases:database:deleted';

export type DatabaseCreatedEventData = Database;
export interface DatabaseUpdatedEventData {
  original: Database;
  updated: Database;
}
export type DatabaseDeletedEventData = Database;

// Entry events
export const DatabaseEntryCreatedEvent = 'databases:entry:created';
export const DatabaseEntryUpdatedEvent = 'databases:entry:updated';
export const DatabaseEntryDeletedEvent = 'databases:entry:deleted';
export const DatabaseEntryRenamedEvent = 'databases:entry:renamed';

export type DatabaseEntryCreatedEventData = DatabaseEntry;
export interface DatabaseEntryUpdatedEventData {
  original: DatabaseEntry;
  updated: DatabaseEntry;
}
export type DatabaseEntryDeletedEventData = DatabaseEntry;
