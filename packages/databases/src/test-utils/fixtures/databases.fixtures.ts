import { DesignFixtures } from '@minddrop/designs-legacy';
import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import {
  FilePropertySchema,
  ImagePropertySchema,
  UrlPropertySchema,
} from '@minddrop/properties';
import { WorkspaceFixtures } from '@minddrop/workspaces';
import { Database, DatabaseEntryTemplate } from '../../types';
import { databaseConfigFilePath, entryTemplateFilePath } from '../../utils';
import { fetchWebpageMetadataAutomation } from './database-automations.fixtures';

const { workspace_1 } = WorkspaceFixtures;
const { layout_card_2, layout_card_3, design_cards } = DesignFixtures;

export const parentDir = workspace_1.path;
export const genericFilePropertyName = 'File';
export const imagePropertyName = 'Image';
export const validImagePropertyFile = new File([], 'valid-image.png');
export const invalidImagePropertyFile = new File([], 'note.txt');
// objectDatabase uses design_cards (layouts: [layout_card_2, layout_card_3])
export const defaultCardLayout = layout_card_3;
export const firstCardLayout = layout_card_2;

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
    designId: design_cards.id,
    designPropertyMap: {},
    defaultLayouts: { card: layout_card_3.id },
    path: `${parentDir}/${data.name}`,
    ...data,
  };
}

export const objectDatabase = generateDatabase({
  id: 'database_objects',
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
  id: 'database_url',
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
  id: 'database_no-properties',
  name: 'No Properties',
  entryName: 'No Properties',
});

export const yamlObjectDatabase = generateDatabase({
  id: 'database_yaml',
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
  id: 'database_root-storage',
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
  id: 'database_common-storage',
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
  id: 'database_property-storage',
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
  id: 'database_entry-storage',
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
  id: 'database_timestamp',
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
  id: 'database_collection',
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

export const entryTemplate1: DatabaseEntryTemplate = {
  id: 'database-entry-template_1',
  name: 'Template One',
  defaultTitle: 'Templated entry',
  properties: {
    Notes: 'Prefilled notes',
    [imagePropertyName]: 'template-image.png',
  },
};

export const entryTemplate2: DatabaseEntryTemplate = {
  id: 'database-entry-template_2',
  name: 'Template Two',
  properties: {},
};

export const entryTemplatesDatabase = generateDatabase({
  id: 'database_entry-templates',
  name: 'Entry Templates Database',
  entryName: 'Entry Templates Entry',
  properties: [
    {
      type: 'text',
      name: 'Notes',
    },
    {
      type: 'number',
      name: 'Count',
    },
    {
      type: 'select',
      name: 'Status',
      options: [
        { value: 'Todo', color: 'blue' },
        { value: 'Done', color: 'green' },
      ],
    },
    {
      type: 'toggle',
      name: 'Urgent',
    },
    {
      type: 'date',
      name: 'Due',
    },
    {
      type: 'image',
      name: imagePropertyName,
    },
  ],
  entryTemplates: [entryTemplate1, entryTemplate2],
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
  entryTemplatesDatabase,
];

export const databaseEntryTemplateFiles: (MockFileDescriptor | string)[] = [
  // The image file stored in entryTemplate1's template directory
  entryTemplateFilePath(
    entryTemplatesDatabase.path,
    entryTemplate1.id,
    'template-image.png',
  ),
];

export const databaseFiles: (MockFileDescriptor | string)[] = [
  parentDir,
  // Individual database config files (path and name are not persisted)
  ...databases.map(({ path, name, ...config }) => ({
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
