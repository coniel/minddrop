import { DesignFixtures } from '@minddrop/designs';
import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import {
  FilePropertySchema,
  ImagePropertySchema,
  UrlPropertySchema,
} from '@minddrop/properties';
import { WorkspaceFixtures } from '@minddrop/workspaces';
import { Database } from '../../types';
import { databaseConfigFilePath } from '../../utils';
import { fetchWebpageMetadataAutomation } from './database-automations.fixtures';

const { workspace_1 } = WorkspaceFixtures;
const { design_card_1, design_card_2, design_card_3, design_list_1 } =
  DesignFixtures;

export const parentDir = workspace_1.path;
export const genericFilePropertyName = 'File';
export const imagePropertyName = 'Image';
export const validImagePropertyFile = new File([], 'valid-image.png');
export const invalidImagePropertyFile = new File([], 'note.txt');
export const defaultCardDesign = design_card_2;
export const firstCardDesign = design_card_1;

function generateDatabase(
  data: Pick<Database, 'id' | 'name' | 'entryName'> & Partial<Database>,
): Database {
  return {
    properties: [],
    entrySerializer: 'markdown',
    icon: 'content-icon:shapes:blue',
    entryOpenMode: 'dialog',
    propertyFileStorage: 'property',
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    designPropertyMaps: {
      [design_card_1.id]: {
        title: 'Title',
      },
      [design_list_1.id]: {
        title: 'Title',
      },
      [design_card_2.id]: {
        title: 'Title',
      },
      [design_card_3.id]: {
        title: 'Title',
      },
    },
    defaultDesigns: { card: design_card_2.id },
    path: `${parentDir}/${data.name}`,
    ...data,
  };
}

export const objectDatabase = generateDatabase({
  id: 'Objects',
  name: 'Objects',
  entryName: 'Object',
  properties: [
    {
      type: 'formatted-text',
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
  id: 'URL Database',
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
  id: 'No Properties',
  name: 'No Properties',
  entryName: 'No Properties',
});

export const yamlObjectDatabase = generateDatabase({
  id: 'YAML Database',
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
  id: 'Root Storage Database',
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
  id: 'Common Storage Database',
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
  id: 'Property Storage Database',
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
  id: 'Entry Storage Database',
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

export const timestampDatabase = generateDatabase({
  id: 'Timestamp Database',
  name: 'Timestamp Database',
  entryName: 'Timestamp Entry',
  properties: [
    {
      type: 'created',
      name: 'Created',
    },
    {
      type: 'last-modified',
      name: 'Last Modified',
    },
  ],
});

export const collectionDatabase = generateDatabase({
  id: 'Collection Database',
  name: 'Collection Database',
  entryName: 'Collection Entry',
  properties: [
    {
      type: 'text',
      name: 'Title',
    },
    {
      type: 'collection',
      name: 'Related',
    },
    {
      type: 'collection',
      name: 'References',
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
  collectionDatabase,
  timestampDatabase,
];

export const databaseFiles: (MockFileDescriptor | string)[] = [
  parentDir,
  // Individual database config files (id and path are not persisted)
  ...databases.map(({ id, path, ...config }) => ({
    path: databaseConfigFilePath(path),
    textContent: JSON.stringify(config, null, 2),
  })),
  // Property file directories
  Fs.concatPath(
    commonStorageDatabase.path,
    commonStorageDatabase.propertyFilesDir!,
  ),
  Fs.concatPath(propertyStorageDatabase.path, imagePropertyName),
];
