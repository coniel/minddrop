import { Events } from '@minddrop/events';
import { I18n } from '@minddrop/i18n';
import { ItemReferences } from '@minddrop/item-references';
import { onItemAddressesChanged } from '../event-handlers';
import { locales } from '../locales';

/**
 * Initializes collections: registers the package's translations and
 * the listeners which keep loaded workspaces' collection files in
 * step with the items they hold.
 */
export function initializeCollections(): void {
  // Register collection translations
  I18n.registerTranslations(locales);

  // Rewrite collection files when member item addresses change
  Events.on(ItemReferences.events.AddressesChanged, 'collections', (data) =>
    onItemAddressesChanged(data),
  );
}
