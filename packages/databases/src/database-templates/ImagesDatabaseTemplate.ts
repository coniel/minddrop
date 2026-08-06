import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Images database template with translated strings.
 */
export const ImagesDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.images.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.images.properties.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:image:default',
    properties: [
      {
        type: 'image',
        name: t(propertyKey('image', 'name')),
        icon: 'content-icon:image:default',
      },
      {
        type: 'text',
        name: t(propertyKey('caption', 'name')),
        icon: 'content-icon:text:default',
      },
      {
        type: 'date',
        name: t(propertyKey('dateTaken', 'name')),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'text',
        name: t(propertyKey('location', 'name')),
        icon: 'content-icon:map-pin:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
