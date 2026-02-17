export const EventListenerId = 'databases-feature';
export const OpenNewDatabaseDialogEvent = 'databases:new-database-dialog:open';
export const OpenDatabaseViewEvent = 'databases:view:open';

export interface OpenDatabaseViewEventData {
  databaseId: string;
  configurationPanelOpen?: boolean;
}
