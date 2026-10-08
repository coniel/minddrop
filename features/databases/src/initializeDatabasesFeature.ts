import { DesignElementConfigs } from '@minddrop/designs-next';
import { I18n } from '@minddrop/i18n';
import { CollectionElementConfig } from './elements';
import { initializeEntryPdfs } from './initializeEntryPdfs';
import { locales } from './locales';

/**
 * Initializes the databases feature: registers its translations and
 * the collection design element.
 *
 * @returns A cleanup function which removes the feature's event listeners.
 */
export function initializeDatabasesFeature(): VoidFunction {
  I18n.registerTranslations(locales);

  // Register the collection design element
  DesignElementConfigs.register(CollectionElementConfig);

  // Bridge the pdf stores to the entries holding the documents
  return initializeEntryPdfs();
}
