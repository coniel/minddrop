import { i18n } from '@minddrop/i18n';
import { DatabaseTemplatesStore } from '../DatabaseTemplatesStore';
import { coreDatabaseTemplates } from '../database-templates';

/**
 * Loads all core database templates into the store.
 */
export function initializeDatabaseTemplates() {
  // Register core data types
  DatabaseTemplatesStore.load(
    coreDatabaseTemplates.map((databaseTemplate) =>
      // Translate template and property names and descriptions
      ({
        ...databaseTemplate,
        name: i18n.t(databaseTemplate.name),
        description: databaseTemplate.description
          ? i18n.t(databaseTemplate.description)
          : undefined,
        properties: databaseTemplate.properties.map((property) => {
          return {
            ...property,
            name: i18n.t(property.name),
            description: property.description
              ? i18n.t(property.description)
              : undefined,
          };
        }),
      }),
    ),
  );
}
