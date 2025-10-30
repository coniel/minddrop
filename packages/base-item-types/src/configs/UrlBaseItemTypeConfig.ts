import { BaseItemTypeConfig } from '../types';

export const UrlBaseItemTypeConfig: BaseItemTypeConfig = {
  type: 'weblink',
  name: 'Weblink',
  description: 'An item that links to an external website.',
  dataType: 'url',
  icon: 'content-icon:link',
  properties: [
    {
      name: 'URL',
      type: 'url',
      description: 'The weblink URL.',
      icon: 'content-icon:link',
    },
    {
      name: 'Title',
      type: 'text',
      description: "The webpage's title.",
      icon: 'content-icon:type',
    },
    {
      name: 'Description',
      type: 'text',
      description: "The webpage's description.",
      icon: 'content-icon:info',
    },
    {
      name: 'Image',
      type: 'image',
      stroage: 'asset',
      description: "The webpage's main or cover image.",
      icon: 'content-icon:image',
    },
    {
      name: 'Icon',
      type: 'image',
      stroage: 'asset',
      description: 'The website icon.',
      icon: 'content-icon:smile',
    },
  ],
};
