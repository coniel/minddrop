import { BaseDirectory, MockFileDescriptor } from '@minddrop/file-system';
import { DatabasesConfigFileName } from '../../constants';
import {
  ObjectDataType,
  PdfDataType,
  UrlDataType,
} from '../../data-type-configs';
import { Database } from '../../types';
import { databaseConfigFilePath } from '../../utils';
import { dataTypeWithSerializer } from './data-types.fixtures';
import { fetchWebpageMetadataAutomation } from './database-automations.fixtures';

export const parentDir = 'path/to/databases';

export const objectDatabase: Database = {
  id: '0e68221f-f0ec-47af-8850-912ff273a8d2',
  name: 'Objects',
  entryName: 'Object',
  dataType: ObjectDataType.type,
  entrySerializer: 'markdown',
  icon: 'content-icon:shapes:blue',
  path: `${parentDir}/Objects`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  properties: [
    {
      type: 'text-formatted',
      name: 'Content',
      defaultValue: 'Default Content',
    },
    {
      type: 'icon',
      name: 'Icon',
    },
  ],
};

export const pdfDatabase: Database = {
  id: 'b8b096fa-4663-4b5e-b8dc-02602a2473b4',
  name: 'PDF Documents',
  entryName: 'PDF',
  dataType: PdfDataType.type,
  entrySerializer: 'markdown',
  icon: 'content-icon:file:default',
  path: `${parentDir}/PDF Documents`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  properties: [
    {
      type: 'icon',
      name: 'Icon',
    },
    {
      type: 'text',
      name: 'Foo',
      defaultValue: 'Bar',
    },
  ],
};

export const urlDatabase: Database = {
  id: 'f0a4b5b0-a1d0-4f6f-b8d2-e2f5a0c0b1b2',
  name: 'URL Database',
  entryName: 'URL',
  dataType: UrlDataType.type,
  entrySerializer: 'markdown',
  icon: 'content-icon:link:default',
  path: `${parentDir}/URL Database`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  properties: UrlDataType.properties,
  automations: [fetchWebpageMetadataAutomation],
};

export const noPropertiesDatabase: Database = {
  id: '533c8ba7-6205-4195-8367-63f0f7539c60',
  name: 'No Properties',
  entryName: 'No Properties',
  dataType: ObjectDataType.type,
  entrySerializer: 'markdown',
  icon: 'content-icon:shapes:blue',
  path: `${parentDir}/No Properties`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  properties: [],
};

export const yamlObjectDatabase: Database = {
  id: '2012fd3a-d8c0-4028-8590-58fe175e04fc',
  name: 'YAML Database',
  entryName: 'YAML',
  dataType: ObjectDataType.type,
  entrySerializer: 'yaml',
  icon: 'content-icon:shapes:blue',
  path: `${parentDir}/YAML Database`,
  created: new Date('2024-01-01T00:00:00.000Z'),
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
};

export const dataTypeSerializerDatabase: Database = {
  id: '8c9870ee-48b7-4074-ada1-8b217eda3167',
  name: 'Data Type Serializer Database',
  entryName: 'Data Type Serializer',
  dataType: dataTypeWithSerializer.type,
  entrySerializer: 'data-type',
  icon: 'content-icon:shapes:blue',
  path: `${parentDir}/Data Type Serializer Database`,
  created: new Date('2024-01-01T00:00:00.000Z'),
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
};

export const databases = [
  objectDatabase,
  pdfDatabase,
  urlDatabase,
  noPropertiesDatabase,
  yamlObjectDatabase,
  dataTypeSerializerDatabase,
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
  {
    path: databaseConfigFilePath(objectDatabase.path),
    textContent: JSON.stringify(objectDatabase, null, 2),
  },
  {
    path: databaseConfigFilePath(noPropertiesDatabase.path),
    textContent: JSON.stringify(noPropertiesDatabase, null, 2),
  },
  {
    path: databaseConfigFilePath(pdfDatabase.path),
    textContent: JSON.stringify(pdfDatabase, null, 2),
  },
  {
    path: databaseConfigFilePath(urlDatabase.path),
    textContent: JSON.stringify(urlDatabase, null, 2),
  },
  {
    path: databaseConfigFilePath(yamlObjectDatabase.path),
    textContent: JSON.stringify(yamlObjectDatabase, null, 2),
  },
  {
    path: databaseConfigFilePath(dataTypeSerializerDatabase.path),
    textContent: JSON.stringify(dataTypeSerializerDatabase, null, 2),
  },
];
