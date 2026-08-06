import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Weblinks database template with translated strings.
 */
export const WeblinksDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.weblinks.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.weblinks.properties.',
  );
  const automationKey = createI18nKeyBuilder(
    'databases.templates.weblinks.automations.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:link:default',
    propertyFileStorage: 'entry',
    properties: [
      {
        type: 'title',
        icon: 'content-icon:type:default',
        name: t(propertyKey('title', 'name')),
      },
      {
        type: 'url',
        icon: 'content-icon:link:default',
        name: t(propertyKey('url', 'name')),
      },
      {
        type: 'text',
        icon: 'content-icon:info:default',
        name: t(propertyKey('description', 'name')),
      },
      {
        type: 'image',
        icon: 'content-icon:image:default',
        name: t(propertyKey('image', 'name')),
      },
      {
        type: 'image',
        icon: 'content-icon:smile:default',
        name: t(propertyKey('icon', 'name')),
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'content-icon:clock:default',
      },
      {
        type: 'last-modified',
        name: t(propertyKey('lastModified', 'name')),
        icon: 'content-icon:clock:default',
      },
    ],
    automations: [
      {
        name: t(automationKey('fetchWebpageMetadata', 'name')),
        description: t(automationKey('fetchWebpageMetadata', 'description')),
        type: 'update-property',
        property: t(propertyKey('url', 'name')),
        actions: [
          {
            type: 'fetch-webpage-metadata',
            propertyMapping: {
              title: t(propertyKey('title', 'name')),
              description: t(propertyKey('description', 'name')),
              icon: t(propertyKey('icon', 'name')),
              image: t(propertyKey('image', 'name')),
            },
          },
        ],
      },
    ],
  };
};
