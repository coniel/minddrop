/**
 * The translation function signature used by database templates.
 */
export type TranslateFn = (key: string) => string;

/**
 * Creates translation helpers for a database template.
 * All helpers call `t` immediately, returning translated strings.
 *
 * @param t - The translation function.
 * @param templateName - The template's i18n key segment.
 * @returns Helpers for translating template names, properties, and automations.
 */
export const createI18n = (t: TranslateFn, templateName: string) => {
  const i18nKey = (key: string) => `databases.templates.${templateName}.${key}`;
  const propertyKey = (property: string, key: string) =>
    `databases.templates.${templateName}.properties.${property}.${key}`;
  const automationKey = (automation: string, key: string) =>
    `databases.templates.${templateName}.automations.${automation}.${key}`;

  return {
    // Translated template name, entry name, and description
    naming: {
      name: t(i18nKey('name')),
      entryName: t(i18nKey('entryName')),
      description: t(i18nKey('description')),
    },
    // Translated property name and description
    property: (property: string) => ({
      name: t(propertyKey(property, 'name')),
      description: t(propertyKey(property, 'description')),
    }),
    // Translated property name only
    propertyName: (property: string) => t(propertyKey(property, 'name')),
    // Translated automation name and description
    automation: (automation: string) => ({
      name: t(automationKey(automation, 'name')),
      description: t(automationKey(automation, 'description')),
    }),
    // Translate an arbitrary i18n key
    t,
  };
};
