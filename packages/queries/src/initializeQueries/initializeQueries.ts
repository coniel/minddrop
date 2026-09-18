import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { QueryGroupsTypeConfig } from '../QueryGroupsTypeConfig';
import { onFileSystemChanged } from '../event-handlers';

/**
 * Initializes queries by registering the query groups entity group
 * type and the listeners which keep loaded workspaces' queries in
 * step with their files.
 *
 * Must be called before the entity groups are loaded.
 */
export function initializeQueries(): void {
  // Apply changes made to query files outside of the app
  Events.on(Fs.events.Changed, 'queries', (data) => onFileSystemChanged(data));

  // Register the query groups entity group type
  EntityGroups.registerType(QueryGroupsTypeConfig);
}
