import { DesignFixtures } from '@minddrop/designs';
import { BaseDirectory, MockFileDescriptor } from '@minddrop/file-system';
import { ViewFixtures } from '@minddrop/views';
import { DatabasesConfigFileName } from '../../constants';
import { Database } from '../../types';
import { databaseConfigFilePath } from '../../utils';
import { fetchWebpageMetadataAutomation } from './database-automations.fixtures';

const { cardDesign1, cardDesign2, listDesign1, pageDesign1 } = DesignFixtures;
const { view1 } = ViewFixtures;

export const parentDir = 'path/to/databases';

function generateDatabase(
  data: Pick<Database, 'id' | 'name' | 'entryName'> & Partial<Database>,
): Database {
  return {
    properties: [],
    entrySerializer: 'markdown',
    icon: 'content-icon:shapes:blue',
    propertyFileStorage: 'property',
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    designs: [cardDesign1, cardDesign2, listDesign1, pageDesign1],
    defaultDesigns: {
      card: cardDesign1.id,
      page: pageDesign1.id,
      list: listDesign1.id,
    },
    views: [view1],
    path: `${parentDir}/${data.name}`,
    ...data,
  };
}

export const objectDatabase = generateDatabase({
  id: '0e68221f-f0ec-47af-8850-912ff273a8d2',
  name: 'Objects',
  entryName: 'Object',
  properties: [
    {
      type: 'text-formatted',
      name: 'Content',
      defaultValue: 'Default Content',
      icon: 'content-icon:shapes:blue',
    },
    {
      type: 'icon',
      name: 'Icon',
    },
  ],
});

export const urlDatabase = generateDatabase({
  id: 'f0a4b5b0-a1d0-4f6f-b8d2-e2f5a0c0b1b2',
  name: 'URL Database',
  entryName: 'URL',
  automations: [fetchWebpageMetadataAutomation],
});

export const noPropertiesDatabase = generateDatabase({
  id: '533c8ba7-6205-4195-8367-63f0f7539c60',
  name: 'No Properties',
  entryName: 'No Properties',
});

export const yamlObjectDatabase = generateDatabase({
  id: '2012fd3a-d8c0-4028-8590-58fe175e04fc',
  name: 'YAML Database',
  entryName: 'YAML',
  entrySerializer: 'yaml',
  properties: [
    {
      type: 'text',
      name: 'Title',
    },
    {
      type: 'icon',
      name: 'Icon',
    },
  ],
});

export const databases = [
  objectDatabase,
  urlDatabase,
  noPropertiesDatabase,
  yamlObjectDatabase,
];

export const databaseFiles: (MockFileDescriptor | string)[] = [
  parentDir,
  // User's databases config file
  {
    path: `${BaseDirectory.AppConfig}/${DatabasesConfigFileName}`,
    textContent: JSON.stringify(
      {
        paths: databases.map((db) => ({ id: db.id, path: db.path })),
      },
      null,
      2,
    ),
  },
  // Individual database config files
  ...databases.map((db) => ({
    path: databaseConfigFilePath(db.path),
    textContent: JSON.stringify(db, null, 2),
  })),
];
