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

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'databases:new-database-dialog:open': void;
    'databases:entry-dialog:close': void;
  }
}
