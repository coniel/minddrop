import { DatabaseTemplate } from '../types';
import { createI18n } from './database-template-utils';

const { naming, property, propertyName, automation } = createI18n('weblinks');

export const WeblinksDatabaseTemplate: DatabaseTemplate = {
  entrySerializer: 'markdown',
  ...naming,
  icon: 'content-icon:link:default',
  propertyFileStorage: 'entry',
  properties: [
    {
      type: 'title',
      icon: 'content-icon:type',
      ...property('title'),
    },
    {
      type: 'url',
      icon: 'content-icon:link',
      ...property('url'),
    },
    {
      type: 'text',
      icon: 'content-icon:info',
      ...property('description'),
    },
    {
      type: 'image',
      icon: 'content-icon:image',
      ...property('image'),
    },
    {
      type: 'image',
      icon: 'content-icon:smile',
      ...property('icon'),
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
