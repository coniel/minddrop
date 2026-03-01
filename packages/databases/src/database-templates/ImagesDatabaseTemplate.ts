import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Images database template with translated strings.
 */
export const ImagesDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'images');

  return {
    ...naming,
    icon: 'content-icon:image:default',
    properties: [
      {
        type: 'image',
        name: propertyName('image'),
        icon: 'content-icon:image:default',
      },
      {
        type: 'text',
        name: propertyName('caption'),
        icon: 'content-icon:text:default',
      },
      {
        type: 'date',
        name: propertyName('dateTaken'),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'text',
        name: propertyName('location'),
        icon: 'content-icon:map-pin:default',
      },
      {
        type: 'created',
        name: propertyName('created'),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
