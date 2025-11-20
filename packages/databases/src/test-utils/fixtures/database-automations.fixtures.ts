import { DatabaseAutomation } from '../../types';
import { urlDatabase } from './databases.fixtures';

export const getWebpageMetadataAutomation: DatabaseAutomation = {
  id: '0e68221f-f0ec-47af-8850-912ff273a8d2',
  name: 'Get Webpage Metadata',
  description: 'Gets the metadata of a webpage.',
  database: urlDatabase.id,
  triggers: [
    {
      type: 'update-property',
      property: 'URL',
      database: urlDatabase.id,
    },
  ],
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
