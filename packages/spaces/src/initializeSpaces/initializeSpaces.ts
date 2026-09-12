import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { onFileSystemChanged, onUpdateVirtualDesign } from '../event-handlers';

/**
 * Initializes spaces by registering the listeners which keep loaded
 * workspaces' spaces in step with their bundles and their owned
 * designs.
 */
export function initializeSpaces(): void {
  // Apply changes made to space bundles outside of the app
  Events.on(Fs.events.Changed, 'spaces', (data) => onFileSystemChanged(data));

  // Persist space owned design edits back into their space files
  Events.on(Designs.events.Updated, 'spaces', (data) =>
    onUpdateVirtualDesign(data),
  );
}
