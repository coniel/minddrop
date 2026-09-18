import { Designs } from '@minddrop/designs';
import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { SpaceGroupsTypeConfig } from '../SpaceGroupsTypeConfig';
import { onFileSystemChanged, onUpdateVirtualDesign } from '../event-handlers';

/**
 * Initializes spaces by registering the space groups entity group
 * type and the listeners which keep loaded workspaces' spaces in
 * step with their bundles and their owned designs.
 *
 * Must be called before the entity groups are loaded.
 */
export function initializeSpaces(): void {
  // Apply changes made to space bundles outside of the app
  Events.on(Fs.events.Changed, 'spaces', (data) => onFileSystemChanged(data));

  // Persist space owned design edits back into their space files
  Events.on(Designs.events.Updated, 'spaces', (data) =>
    onUpdateVirtualDesign(data),
  );

  // Register the space groups entity group type
  EntityGroups.registerType(SpaceGroupsTypeConfig);
}
