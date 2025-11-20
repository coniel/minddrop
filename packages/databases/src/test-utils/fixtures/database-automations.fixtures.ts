import { DatabaseAutomation } from '../../types';

export const fetchWebpageMetadataAutomation: DatabaseAutomation = {
  id: '0e68221f-f0ec-47af-8850-912ff273a8d2',
  name: 'Get Webpage Metadata',
  description: 'Gets the metadata of a webpage.',
  type: 'update-property',
  property: 'URL',
  actions: [
    {
      type: 'fetch-webpage-metadata',
      propertyMapping: {
        title: 'Title',
        description: 'Description',
        icon: 'Icon',
        image: 'Image',
      },
    },
  ],
};
