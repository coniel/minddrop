import { DatabaseEntryOpenMode } from '@minddrop/databases';

export const EventListenerId = 'database-entries-feature';
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
