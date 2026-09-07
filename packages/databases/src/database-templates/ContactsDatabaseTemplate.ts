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
    icon: 'lucide:users:default',
    properties: [
      {
        type: 'text',
        name: t(propertyKey('email', 'name')),
        icon: 'lucide:mail:default',
      },
      {
        type: 'text',
        name: t(propertyKey('phone', 'name')),
        icon: 'lucide:phone:default',
      },
      {
        type: 'text',
        name: t(propertyKey('company', 'name')),
        icon: 'lucide:building-2:default',
      },
      {
        type: 'text',
        name: t(propertyKey('role', 'name')),
        icon: 'lucide:briefcase:default',
      },
      {
        type: 'image',
        name: t(propertyKey('photo', 'name')),
        icon: 'lucide:image:default',
      },
      {
        type: 'formatted-text',
        name: t(propertyKey('notes', 'name')),
        icon: 'lucide:text-quote:default',
      },
    ],
  };
};
