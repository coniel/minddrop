import { DataType } from '../types';

const propertyNames = {
  url: 'dataTypes.url.properties.url.name',
  title: 'dataTypes.url.properties.title.name',
  description: 'dataTypes.url.properties.description.name',
  image: 'dataTypes.url.properties.image.name',
  icon: 'dataTypes.url.properties.icon.name',
};

export const UrlDataType: DataType = {
  type: 'url',
  name: 'dataTypes.url.name',
  description: 'dataTypes.url.description',
  icon: 'content-icon:link:default',
  properties: [
    {
      type: 'title',
      name: propertyNames.title,
      description: 'dataTypes.url.properties.title.description',
      icon: 'content-icon:type',
    },
    {
      type: 'url',
      name: propertyNames.url,
      description: 'dataTypes.url.properties.url.description',
      icon: 'content-icon:link',
      protected: true,
    },
    {
      type: 'text',
      name: propertyNames.description,
      description: 'dataTypes.url.properties.description.description',
      icon: 'content-icon:info',
    },
    {
      type: 'image',
      storage: 'asset',
      name: propertyNames.image,
      description: 'dataTypes.url.properties.image.description',
      icon: 'content-icon:image',
    },
    {
      type: 'image',
      storage: 'asset',
      name: propertyNames.icon,
      description: 'dataTypes.url.properties.icon.description',
      icon: 'content-icon:smile',
    },
  ],
  automations: [
    {
      name: 'dataTypes.url.automations.fetchWebpageMetadata.name',
      description: 'dataTypes.url.automations.fetchWebpageMetadata.description',
      type: 'update-property',
      property: propertyNames.url,
      actions: [
        {
          type: 'fetch-webpage-metadata',
          propertyMapping: {
            title: propertyNames.title,
            description: propertyNames.description,
            icon: propertyNames.icon,
            image: propertyNames.image,
          },
        },
      ],
    },
  ],
};
