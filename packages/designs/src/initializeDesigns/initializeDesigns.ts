import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { onFileSystemChanged } from '../event-handlers';
import { registerDesignRole } from '../registerDesignRole';
import { BuiltInDesignRoles } from '../roles';

/**
 * Initializes designs: registers the built-in roles and the
 * listeners which keep loaded workspaces' designs in step with
 * their files.
 */
export function initializeDesigns(): void {
  // Register the built-in design roles
  BuiltInDesignRoles.forEach(registerDesignRole);

  // Apply changes made to design bundles outside of the app
  Events.on(Fs.events.Changed, 'designs', (data) => onFileSystemChanged(data));
}
