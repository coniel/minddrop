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
    icon: 'lucide:image:default',
    properties: [
      {
        type: 'image',
        name: t(propertyKey('image', 'name')),
        icon: 'lucide:image:default',
      },
      {
        type: 'text',
        name: t(propertyKey('caption', 'name')),
        icon: 'lucide:text-align-start:default',
      },
      {
        type: 'date',
        name: t(propertyKey('dateTaken', 'name')),
        icon: 'lucide:calendar:default',
      },
      {
        type: 'text',
        name: t(propertyKey('location', 'name')),
        icon: 'lucide:map-pin:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'lucide:clock:default',
      },
    ],
  };
};
