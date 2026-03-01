import { i18n } from '@minddrop/i18n';
import { DatabaseTemplatesStore } from '../DatabaseTemplatesStore';
import { coreDatabaseTemplates } from '../database-templates';

/**
 * Loads all core database templates into the store.
 * Each template function handles its own translation.
 */
export function initializeDatabaseTemplates() {
  // Call each template function with the i18n translate function
  const translate = (key: string) => i18n.t(key);

  DatabaseTemplatesStore.load(
    coreDatabaseTemplates.map((templateFn) => templateFn(translate)),
  );
}
