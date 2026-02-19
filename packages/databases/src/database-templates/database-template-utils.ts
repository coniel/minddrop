export const createI18n = (templateName: string) => {
  const i18nKey = (key: string) => `databases.templates.${templateName}.${key}`;
  const propertyKey = (property: string, key: string) =>
    `databases.templates.${templateName}.properties.${property}.${key}`;
  const automationKey = (automation: string, key: string) =>
    `databases.templates.${templateName}.automations.${automation}.${key}`;

  return {
    naming: {
      name: i18nKey('name'),
      entryName: i18nKey('entryName'),
      description: i18nKey('description'),
    },
    property: (property: string) => ({
      name: propertyKey(property, 'name'),
      description: propertyKey(property, 'description'),
    }),
    propertyName: (property: string) => propertyKey(property, 'name'),
    automation: (automation: string) => ({
      name: automationKey(automation, 'name'),
      description: automationKey(automation, 'description'),
    }),
  };
};
