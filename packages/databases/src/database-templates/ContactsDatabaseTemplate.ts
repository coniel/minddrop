import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Contacts database template with translated strings.
 */
export const ContactsDatabaseTemplate: DatabaseTemplateFn = (
  t: TranslateFn,
) => {
  const { naming, propertyName } = createI18n(t, 'contacts');

  return {
    ...naming,
    icon: 'content-icon:users:default',
    properties: [
      {
        type: 'text',
        name: propertyName('email'),
        icon: 'content-icon:mail:default',
      },
      {
        type: 'text',
        name: propertyName('phone'),
        icon: 'content-icon:phone:default',
      },
      {
        type: 'text',
        name: propertyName('company'),
        icon: 'content-icon:building-2:default',
      },
      {
        type: 'text',
        name: propertyName('role'),
        icon: 'content-icon:briefcase:default',
      },
      {
        type: 'image',
        name: propertyName('photo'),
        icon: 'content-icon:image:default',
      },
      {
        type: 'formatted-text',
        name: propertyName('notes'),
        icon: 'content-icon:text-quote:default',
      },
    ],
  };
};
