import { i18n } from '@minddrop/i18n';
import { DataType } from '../types';

export const UrlDataType: DataType = {
  type: 'url',
  name: 'dataTypes.url.name',
  description: 'dataTypes.url.description',
  icon: 'content-icon:link:default',
  properties: [
    {
      type: 'url',
      name: 'dataTypes.url.properties.url.name',
      description: 'dataTypes.url.properties.url.description',
      icon: 'content-icon:link',
      protected: true,
    },
    {
      type: 'text',
      name: 'dataTypes.url.properties.title.name',
      description: 'dataTypes.url.properties.title.description',
      icon: 'content-icon:type',
    },
    {
      type: 'text',
      name: 'dataTypes.url.properties.description.name',
      description: 'dataTypes.url.properties.description.description',
      icon: 'content-icon:info',
    },
    {
      type: 'image',
      storage: 'asset',
      name: 'dataTypes.url.properties.image.name',
      description: 'dataTypes.url.properties.image.description',
      icon: 'content-icon:image',
    },
    {
      type: 'image',
      storage: 'asset',
      name: 'dataTypes.url.properties.icon.name',
      description: 'dataTypes.url.properties.icon.description',
      icon: 'content-icon:smile',
    },
  ],
};
