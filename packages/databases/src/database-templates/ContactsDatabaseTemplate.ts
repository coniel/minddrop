import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Contacts database template with translated strings.
 */
export const ContactsDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.contacts.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.contacts.properties.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:users:default',
    properties: [
      {
        type: 'text',
        name: t(propertyKey('email', 'name')),
        icon: 'content-icon:mail:default',
      },
      {
        type: 'text',
        name: t(propertyKey('phone', 'name')),
        icon: 'content-icon:phone:default',
      },
      {
        type: 'text',
        name: t(propertyKey('company', 'name')),
        icon: 'content-icon:building-2:default',
      },
      {
        type: 'text',
        name: t(propertyKey('role', 'name')),
        icon: 'content-icon:briefcase:default',
      },
      {
        type: 'image',
        name: t(propertyKey('photo', 'name')),
        icon: 'content-icon:image:default',
      },
      {
        type: 'formatted-text',
        name: t(propertyKey('notes', 'name')),
        icon: 'content-icon:text-quote:default',
      },
    ],
  };
};
