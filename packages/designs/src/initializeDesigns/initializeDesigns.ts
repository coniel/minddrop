import { Events } from '@minddrop/events';
import { FileSystemChangedEvent, Fs } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
import { onFileSystemChanged } from '../event-handlers';
import { DesignsLoadedEvent } from '../events';
import { readDesign } from '../readDesign';
import { registerDesignRole } from '../registerDesignRole';
import { BuiltInDesignRoles } from '../roles';
import { resolveDesignsDirPath } from '../utils';

/**
 * Initializes designs: registers the built-in roles, then reads
 * design bundles from the file system into the store.
 *
 * @dispatches 'designs:loaded'
 */
export async function initializeDesigns(): Promise<void> {
  // Register the built-in design roles
  BuiltInDesignRoles.forEach(registerDesignRole);

  // Apply changes made to design bundles outside of the app.
  // Registered before the load so that designs created while the
  // directory does not yet exist are still picked up.
  Events.on(FileSystemChangedEvent, 'designs', (data) =>
    onFileSystemChanged(data),
  );

  // Nothing to load if the designs directory does not exist yet.
  // The loaded event still fires so that listeners waiting on it
  // are not left hanging in a workspace with no designs.
  if (!(await Fs.exists(resolveDesignsDirPath()))) {
    Events.dispatch(DesignsLoadedEvent, []);

    return;
  }

  // Read the entries in the designs directory
  const entries = await Fs.readDir(resolveDesignsDirPath());

  // Read a design from each entry, discarding entries which are
  // not valid design bundles
  const designs = (
    await Promise.all(entries.map((entry) => readDesign(entry.path)))
  ).filter((design) => design !== null);

  // Load designs into the store
  DesignsStore.load(designs);

  // Dispatch a designs loaded event
  Events.dispatch(DesignsLoadedEvent, designs);
}
