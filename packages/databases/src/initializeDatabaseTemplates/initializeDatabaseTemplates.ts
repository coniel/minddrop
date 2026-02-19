import { i18n } from '@minddrop/i18n';
import { DatabaseTemplatesStore } from '../DatabaseTemplatesStore';
import { coreDatabaseTemplates } from '../database-templates';

/**
 * Loads all core database templates into the store.
 */
export function initializeDatabaseTemplates() {
  DatabaseTemplatesStore.load(
    coreDatabaseTemplates.map((template) =>
      // Translate template and property names and descriptions
      ({
        ...template,
        name: i18n.t(template.name),
        description: template.description
          ? i18n.t(template.description)
          : undefined,
        properties: template.properties.map((property) => {
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
