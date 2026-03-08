import { PropertySchema } from '@minddrop/properties';
import { Database, DatabaseEntry } from './types';

// Database events
export const DatabaseCreatedEvent = 'databases:database:created';
export const DatabaseUpdatedEvent = 'databases:database:updated';
export const DatabaseDeletedEvent = 'databases:database:deleted';
export const DatabaseRenamedEvent = 'databases:database:renamed';

export type DatabaseCreatedEventData = Database;
export interface DatabaseUpdatedEventData {
  original: Database;
  updated: Database;
}
export type DatabaseDeletedEventData = Database;
export interface DatabaseRenamedEventData {
  original: Database;
  updated: Database;
}

// Property events
export const DatabasePropertyAddedEvent = 'databases:property:added';
export const DatabasePropertyRemovedEvent = 'databases:property:removed';
export const DatabasePropertyRenamedEvent = 'databases:property:renamed';

export interface DatabasePropertyAddedEventData {
  /**
   * The database the property was added to.
   */
  database: Database;

  /**
   * The property that was added.
   */
  property: PropertySchema;
}

export interface DatabasePropertyRemovedEventData {
  /**
   * The database the property was removed from.
   */
  database: Database;

  /**
   * The property that was removed.
   */
  property: PropertySchema;
}

export interface DatabasePropertyRenamedEventData {
  /**
   * The database the property belongs to.
   */
  database: Database;

  /**
   * The original property name.
   */
  oldName: string;

  /**
   * The new property name.
   */
  newName: string;
}

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
export interface DatabaseEntryRenamedEventData {
  original: DatabaseEntry;
  updated: DatabaseEntry;
}
