import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { onFileSystemChanged, onItemAddressesChanged } from '../event-handlers';

/**
 * Initializes content views by registering the listeners which keep
 * loaded workspaces' content views in step with their files and the
 * items they reference.
 */
export function initializeContentViews(): void {
  // Apply changes made to content view files outside of the app
  Events.on(Fs.events.Changed, 'content-views', (data) =>
    onFileSystemChanged(data),
  );

  // Rewrite view files when referenced item addresses change
  Events.on(ItemReferences.events.AddressesChanged, 'content-views', (data) =>
    onItemAddressesChanged(data),
  );
}
