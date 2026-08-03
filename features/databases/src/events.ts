export {
  OpenDatabaseViewEvent,
  type OpenDatabaseViewEventData,
  OpenDatabaseEntryViewEvent,
  type OpenDatabaseEntryViewEventData,
} from '@minddrop/databases';

export const EventListenerId = 'databases-feature';
export const OpenNewDatabaseDialogEvent = 'databases:new-database-dialog:open';
export const DatabaseViewName = 'databases:view:database';
export const DatabaseEntryViewName = 'databases:view:entry';

// -- Database Entries events --

export const DatabaseEntriesEventListenerId = 'database-entries-feature';
export const CloseDatabaseEntryDialogEvent = 'databases:entry-dialog:close';
