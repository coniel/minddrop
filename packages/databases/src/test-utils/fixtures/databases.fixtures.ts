import { DesignFixtures } from '@minddrop/designs';
import { BaseDirectory, Fs, MockFileDescriptor } from '@minddrop/file-system';
import {
  FilePropertySchema,
  ImagePropertySchema,
  UrlPropertySchema,
} from '@minddrop/properties';
import { ViewFixtures } from '@minddrop/views';
import { DatabasesConfigFileName } from '../../constants';
import { Database } from '../../types';
import { databaseConfigFilePath } from '../../utils';
import { fetchWebpageMetadataAutomation } from './database-automations.fixtures';

const { cardDesign1, cardDesign2, listDesign1, pageDesign1 } = DesignFixtures;
const { view1 } = ViewFixtures;

export const parentDir = 'path/to/databases';
export const genericFilePropertyName = 'File';
export const imagePropertyName = 'Image';
export const validImagePropertyFile = new File([], 'valid-image.png');
export const invalidImagePropertyFile = new File([], 'note.txt');

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
  id: 'object-database',
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
  id: 'url-database',
  name: 'URL Database',
  entryName: 'URL',
  defaultProperties: {
    [UrlPropertySchema.type]: 'URL',
  },
  properties: [
    {
      type: 'url',
      name: 'URL',
    },
  ],
  automations: [fetchWebpageMetadataAutomation],
});

export const noPropertiesDatabase = generateDatabase({
  id: 'no-properties-database',
  name: 'No Properties',
  entryName: 'No Properties',
});

export const yamlObjectDatabase = generateDatabase({
  id: 'yaml-database',
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

export const rootStorageDatabase = generateDatabase({
  id: 'root-storage-database',
  entrySerializer: 'markdown',
  name: 'Root Storage Database',
  entryName: 'Root Storage',
  propertyFileStorage: 'root',
  propertyFilesDir: 'Media',
  defaultProperties: {
    [FilePropertySchema.type]: genericFilePropertyName,
    [ImagePropertySchema.type]: imagePropertyName,
  },
  properties: [
    {
      type: 'image',
      name: imagePropertyName,
    },
    {
      type: 'file',
      name: genericFilePropertyName,
    },
  ],
});

export const commonStorageDatabase = generateDatabase({
  id: 'common-storage-database',
  entrySerializer: 'markdown',
  name: 'Common Storage Database',
  entryName: 'Common Storage',
  propertyFileStorage: 'common',
  propertyFilesDir: 'Media',
  defaultProperties: {
    [FilePropertySchema.type]: genericFilePropertyName,
    [ImagePropertySchema.type]: imagePropertyName,
  },
  properties: [
    {
      type: 'image',
      name: imagePropertyName,
    },
    {
      type: 'file',
      name: genericFilePropertyName,
    },
  ],
});

export const propertyStorageDatabase = generateDatabase({
  id: 'property-storage-database',
  entrySerializer: 'markdown',
  name: 'Property Storage Database',
  entryName: 'Property Storage',
  propertyFileStorage: 'property',
  defaultProperties: {
    [FilePropertySchema.type]: genericFilePropertyName,
    [ImagePropertySchema.type]: imagePropertyName,
  },
  properties: [
    {
      type: 'image',
      name: imagePropertyName,
    },
    {
      type: 'file',
      name: genericFilePropertyName,
    },
  ],
});

export const entryStorageDatabase = generateDatabase({
  id: 'entry-storage-database',
  entrySerializer: 'markdown',
  name: 'Entry Storage Database',
  entryName: 'Entry Storage',
  propertyFileStorage: 'entry',
  defaultProperties: {
    [FilePropertySchema.type]: genericFilePropertyName,
    [ImagePropertySchema.type]: imagePropertyName,
  },
  properties: [
    {
      type: 'image',
      name: 'Image',
    },
    {
      type: 'file',
      name: genericFilePropertyName,
    },
  ],
});

export const databases = [
  objectDatabase,
  urlDatabase,
  noPropertiesDatabase,
  yamlObjectDatabase,
  rootStorageDatabase,
  commonStorageDatabase,
  propertyStorageDatabase,
  entryStorageDatabase,
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
  // Property file directories
  Fs.concatPath(
    commonStorageDatabase.path,
    commonStorageDatabase.propertyFilesDir!,
  ),
  Fs.concatPath(propertyStorageDatabase.path, imagePropertyName),
];
