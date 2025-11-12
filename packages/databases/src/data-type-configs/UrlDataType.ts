import { i18n } from '@minddrop/i18n';
import { DataType } from '../types';

export const UrlDataType: DataType = {
  type: 'url',
  name: i18n.t('databases.url.name'),
  description: i18n.t('databases.url.description'),
  icon: 'content-icon:link:default',
  properties: [
    {
      type: 'url',
      name: i18n.t('databases.url.properties.url.name'),
      description: i18n.t('databases.url.properties.url.description'),
      icon: 'content-icon:link',
      protected: true,
    },
    {
      type: 'text',
      name: i18n.t('databases.url.properties.title.name'),
      description: i18n.t('databases.url.properties.title.description'),
      icon: 'content-icon:type',
    },
    {
      type: 'text',
      name: i18n.t('databases.url.properties.description.name'),
      description: i18n.t('databases.url.properties.description.description'),
      icon: 'content-icon:info',
    },
    {
      type: 'image',
      storage: 'asset',
      name: i18n.t('databases.url.properties.image.name'),
      description: i18n.t('databases.url.properties.image.description'),
      icon: 'content-icon:image',
    },
    {
      type: 'image',
      storage: 'asset',
      name: i18n.t('databases.url.properties.icon.name'),
      description: i18n.t('databases.url.properties.icon.description'),
      icon: 'content-icon:smile',
    },
  ],
};
