import { DatabaseTemplate } from '../types';

const i18nKey = (key: string) => `databaseTemplates.weblinks.${key}`;
const propertyName = (property: string) =>
  `${i18nKey('properties')}.${property}.name`;
const propertyDescription = (property: string) =>
  `${i18nKey('properties')}.${property}.description`;
const automationName = (automation: string) =>
  `${i18nKey('automations')}.${automation}.name`;
const automationDescription = (automation: string) =>
  `${i18nKey('automations')}.${automation}.description`;

export const WeblinksDatabaseTemplate: DatabaseTemplate = {
  entrySerializer: 'markdown',
  name: i18nKey('name'),
  entryName: i18nKey('entryName'),
  description: i18nKey('description'),
  icon: 'content-icon:pencil:default',
  properties: [
    {
      type: 'title',
      name: propertyName('title'),
      description: propertyDescription('title'),
      icon: 'content-icon:type',
    },
    {
      type: 'url',
      name: propertyName('url'),
      description: propertyDescription('url'),
      icon: 'content-icon:link',
      protected: true,
    },
    {
      type: 'text',
      name: propertyName('description'),
      description: propertyDescription('description'),
      icon: 'content-icon:info',
    },
    {
      type: 'image',
      storage: 'asset',
      name: propertyName('image'),
      description: propertyDescription('image'),
      icon: 'content-icon:image',
    },
    {
      type: 'image',
      storage: 'asset',
      name: propertyName('icon'),
      description: propertyDescription('icon'),
      icon: 'content-icon:smile',
    },
  ],
  automations: [
    {
      name: automationName('fetchWebpageMetadata'),
      description: automationDescription('fetchWebpageMetadata'),
      type: 'update-property',
      property: propertyName('url'),
      actions: [
        {
          type: 'fetch-webpage-metadata',
          propertyMapping: {
            title: propertyName('title'),
            description: propertyName('description'),
            icon: propertyName('icon'),
            image: propertyName('image'),
          },
        },
      ],
    },
  ],
};
