import { DatabaseEntryOpenMode } from '@minddrop/databases';

export const EventListenerId = 'databases-feature';
export const OpenNewDatabaseDialogEvent = 'databases:new-database-dialog:open';
export const OpenDatabaseViewEvent = 'databases:view:open';
export const MainDatabaseViewName = 'databases:view:database';
export const MainDatabaseEntryViewName = 'databases:view:entry';

export interface OpenDatabaseViewEventData {
  databaseId: string;
  configurationPanelOpen?: boolean;
}

// -- Database Entries events --

export const DatabaseEntriesEventListenerId = 'database-entries-feature';
export const OpenDatabaseEntryEvent = 'database-entries:entry:open';

export interface OpenDatabaseEntryEventData {
  /**
   * The ID of the database entry to open.
   */
  entryId: string;

  /**
   * How to open the entry. If not provided, falls back to the
   * database's `entryOpenMode` setting.
   */
  openMode?: DatabaseEntryOpenMode;
}
