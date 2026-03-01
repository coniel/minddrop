import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Videos database template with translated strings.
 */
export const VideosDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'videos');

  return {
    ...naming,
    icon: 'content-icon:film:default',
    properties: [
      {
        type: 'file',
        name: propertyName('file'),
        icon: 'content-icon:file-video:default',
      },
      {
        type: 'image',
        name: propertyName('thumbnail'),
        icon: 'content-icon:image:default',
      },
      {
        type: 'text',
        name: propertyName('description'),
        icon: 'content-icon:text:default',
      },
      {
        type: 'number',
        name: propertyName('duration'),
        icon: 'content-icon:timer:default',
      },
      {
        type: 'created',
        name: propertyName('created'),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
