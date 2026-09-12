import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { onFileSystemChanged, onItemAddressesChanged } from '../event-handlers';

/**
 * Initializes data views by registering the listeners which keep
 * loaded workspaces' data views in step with their files and the
 * items they reference.
 */
export function initializeDataViews(): void {
  // Apply changes made to data view files outside of the app
  Events.on(Fs.events.Changed, 'data-views', (data) =>
    onFileSystemChanged(data),
  );

  // Rewrite view files when referenced item addresses change
  Events.on(ItemReferences.events.AddressesChanged, 'data-views', (data) =>
    onItemAddressesChanged(data),
  );
}
