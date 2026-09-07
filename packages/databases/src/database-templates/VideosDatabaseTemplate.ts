import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Videos database template with translated strings.
 */
export const VideosDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.videos.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.videos.properties.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'lucide:film:default',
    properties: [
      {
        type: 'file',
        name: t(propertyKey('file', 'name')),
        icon: 'lucide:file-play:default',
      },
      {
        type: 'image',
        name: t(propertyKey('thumbnail', 'name')),
        icon: 'lucide:image:default',
      },
      {
        type: 'text',
        name: t(propertyKey('description', 'name')),
        icon: 'lucide:text-align-start:default',
      },
      {
        type: 'number',
        name: t(propertyKey('duration', 'name')),
        icon: 'lucide:timer:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'lucide:clock:default',
      },
    ],
  };
};
