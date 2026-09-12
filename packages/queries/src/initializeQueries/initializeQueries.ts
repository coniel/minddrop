import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { onFileSystemChanged } from '../event-handlers';

/**
 * Initializes queries by registering the listeners which keep loaded
 * workspaces' queries in step with their files.
 */
export function initializeQueries(): void {
  // Apply changes made to query files outside of the app
  Events.on(Fs.events.Changed, 'queries', (data) => onFileSystemChanged(data));
}
