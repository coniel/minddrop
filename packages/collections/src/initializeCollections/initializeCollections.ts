import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { I18n } from '@minddrop/i18n';
import { ItemReferences } from '@minddrop/item-references';
import { CollectionGroupsTypeConfig } from '../CollectionGroupsTypeConfig';
import { onItemAddressesChanged } from '../event-handlers';
import { locales } from '../locales';

/**
 * Initializes collections: registers the package's translations,
 * the collection groups entity group type and the listeners which
 * keep loaded workspaces' collection files in step with the items
 * they hold.
 *
 * Must be called before the entity groups are loaded.
 */
export function initializeCollections(): void {
  // Register collection translations
  I18n.registerTranslations(locales);

  // Rewrite collection files when member item addresses change
  Events.on(ItemReferences.events.AddressesChanged, 'collections', (data) =>
    onItemAddressesChanged(data),
  );

  // Register the collection groups entity group type
  EntityGroups.registerType(CollectionGroupsTypeConfig);
}
