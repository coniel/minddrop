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
    icon: 'content-icon:film:default',
    properties: [
      {
        type: 'file',
        name: t(propertyKey('file', 'name')),
        icon: 'content-icon:file-video:default',
      },
      {
        type: 'image',
        name: t(propertyKey('thumbnail', 'name')),
        icon: 'content-icon:image:default',
      },
      {
        type: 'text',
        name: t(propertyKey('description', 'name')),
        icon: 'content-icon:text:default',
      },
      {
        type: 'number',
        name: t(propertyKey('duration', 'name')),
        icon: 'content-icon:timer:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
