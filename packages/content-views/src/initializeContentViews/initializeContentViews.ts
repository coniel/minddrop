import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { ContentViewGroupsTypeConfig } from '../ContentViewGroupsTypeConfig';
import { onFileSystemChanged, onItemAddressesChanged } from '../event-handlers';

/**
 * Initializes content views by registering the content view groups
 * entity group type and the listeners which keep loaded workspaces'
 * content views in step with their files and the items they
 * reference.
 *
 * Must be called before the entity groups are loaded.
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

  // Register the content view groups entity group type
  EntityGroups.registerType(ContentViewGroupsTypeConfig);
}
