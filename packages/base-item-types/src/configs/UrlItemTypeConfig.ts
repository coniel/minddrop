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
    },
    {
      name: 'Title',
      type: 'text',
      description: "The webpage's title.",
    },
    {
      name: 'Description',
      type: 'text',
      description: "The webpage's description.",
    },
    {
      name: 'Image',
      type: 'image',
      stroage: 'asset',
      description: "The webpage's main or cover image.",
    },
    {
      name: 'Icon',
      type: 'image',
      stroage: 'asset',
      description: 'The website icon.',
    },
  ],
};
