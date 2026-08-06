import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Music database template with translated strings.
 */
export const MusicDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.music.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.music.properties.',
  );

  // Key builder for the genre option keys
  const genreKey = createI18nKeyBuilder(
    'databases.templates.music.options.genre.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:music:default',
    properties: [
      {
        type: 'file',
        name: t(propertyKey('file', 'name')),
        icon: 'content-icon:music:default',
      },
      {
        type: 'text',
        name: t(propertyKey('artist', 'name')),
        icon: 'content-icon:user:default',
      },
      {
        type: 'text',
        name: t(propertyKey('album', 'name')),
        icon: 'content-icon:disc:default',
      },
      {
        type: 'select',
        name: t(propertyKey('genre', 'name')),
        icon: 'content-icon:tag:default',
        options: [
          { value: t(genreKey('pop')), color: 'pink' },
          { value: t(genreKey('rock')), color: 'red' },
          { value: t(genreKey('hiphop')), color: 'purple' },
          { value: t(genreKey('electronic')), color: 'blue' },
          { value: t(genreKey('jazz')), color: 'orange' },
          { value: t(genreKey('classical')), color: 'brown' },
          { value: t(genreKey('rnb')), color: 'cyan' },
          { value: t(genreKey('country')), color: 'yellow' },
          { value: t(genreKey('metal')), color: 'gray' },
          { value: t(genreKey('folk')), color: 'green' },
        ],
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
