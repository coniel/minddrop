import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Weblinks database template with translated strings.
 */
export const WeblinksDatabaseTemplate: DatabaseTemplateFn = (
  t: TranslateFn,
) => {
  const { naming, property, propertyName, automation } = createI18n(
    t,
    'weblinks',
  );

  return {
    ...naming,
    icon: 'content-icon:link:default',
    propertyFileStorage: 'entry',
    properties: [
      {
        type: 'title',
        icon: 'content-icon:type:default',
        ...property('title'),
      },
      {
        type: 'url',
        icon: 'content-icon:link:default',
        ...property('url'),
      },
      {
        type: 'text',
        icon: 'content-icon:info:default',
        ...property('description'),
      },
      {
        type: 'image',
        icon: 'content-icon:image:default',
        ...property('image'),
      },
      {
        type: 'image',
        icon: 'content-icon:smile:default',
        ...property('icon'),
      },
      {
        type: 'created',
        name: propertyName('created'),
        icon: 'content-icon:clock:default',
      },
      {
        type: 'last-modified',
        name: propertyName('lastModified'),
        icon: 'content-icon:clock:default',
      },
    ],
    automations: [
      {
        ...automation('fetchWebpageMetadata'),
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
};
