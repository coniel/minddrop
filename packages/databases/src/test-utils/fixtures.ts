import { BaseDirectory, MockFileDescriptor } from '@minddrop/file-system';
import { DatabasesConfigFileName } from '../constants';
import { ObjectDataType, PdfDataType, UrlDataType } from '../data-type-configs';
import { DataType, Database, DatabaseEntry } from '../types';
import {
  databaseConfigFilePath,
  entryCorePropertiesFilePath,
  fileEntryPropertiesFilePath,
} from '../utils';

export const parentDir = 'path/to/databases';

// Data types

export const dataTypeWithSerializer: DataType = {
  type: 'data-type-with-serializer',
  name: 'Data Type With Serializer',
  description: 'A data type with a custom serializer.',
  icon: 'content-icon:shapes:blue',
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
  file: false,
  serialize: (database, entry) => {
    return JSON.stringify({ properties: entry.properties, data: entry.data });
  },
  deserialize: (database, serializedEntry) => {
    const entry = JSON.parse(serializedEntry);

    return {
      properties: entry.properties,
      data: entry.data,
    };
  },
  fileExtension: 'json',
};

export const dataTypes = [dataTypeWithSerializer];

// Databases

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
  properties: [],
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

// Database entries

export const objectEntry1: DatabaseEntry = {
  id: 'ffc1e0a1-e014-49b2-a0cb-f86f9eef367c',
  title: 'Test Entry',
  database: objectDatabase.id,
  path: `${objectDatabase.path}/Test Entry.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Content: 'Test content',
    Icon: 'content-icon:shapes:blue',
  },
};

export const objectEntry1FileContents = `---
Icon: content-icon:shapes:blue
---

Default Content`;

export const objectEntry1CorePropertiesFileContents = `title: ${objectEntry1.title}
created: ${objectEntry1.created.toISOString()}
lastModified: ${objectEntry1.lastModified.toISOString()}`;

export const pdfEntry1: DatabaseEntry = {
  id: '4f086791-3b00-419a-88f2-e671a10236ed',
  title: 'Test Entry',
  database: pdfDatabase.id,
  path: `${pdfDatabase.path}/Test Entry.pdf`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Icon: 'content-icon:shapes:blue',
  },
};

export const pdfEntry1FileContents = `---
Icon: content-icon:shapes:blue
Foo: Bar
---`;

export const pdfEntry1CorePropertiesFileContents = `title: ${pdfEntry1.title}
created: ${pdfEntry1.created.toISOString()}
lastModified: ${pdfEntry1.lastModified.toISOString()}`;

export const yamlObjectEntry1: DatabaseEntry = {
  id: '01733d4a-acb4-41be-bd99-219b5eb1efd6',
  title: 'Test Entry',
  database: yamlObjectDatabase.id,
  path: `${yamlObjectDatabase.path}/Test Entry.yaml`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Title: 'Test Entry',
    Icon: 'content-icon:shapes:blue',
  },
};

export const urlEntry1: DatabaseEntry = {
  id: 'fff02a8f-9678-4539-9da4-74dd876ec2e0',
  title: 'Test Entry',
  database: urlDatabase.id,
  path: `${urlDatabase.path}/Test Entry.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    URL: 'https://example.com/some-page',
    Title: 'Test Entry',
    Description: 'Test description',
    Image: 'image.png',
    Icon: 'icon.png',
  },
};

export const urlEntry1FileContents = `---
URL: https://example.com/some-page
Title: Test Entry
Description: Test description
Image: image.png
Icon: icon.png
---`;

export const urlEntry1CorePropertiesFileContents = `title: ${urlEntry1.title}
created: ${urlEntry1.created.toISOString()}
lastModified: ${urlEntry1.lastModified.toISOString()}`;

export const yamlObjectEntry1FileContents = `title: Test Entry
icon: content-icon:shapes:blue`;

export const yamlObjectEntry1CorePropertiesFileContents = `title: ${yamlObjectEntry1.title}
created: ${yamlObjectEntry1.created.toISOString()}
lastModified: ${yamlObjectEntry1.lastModified.toISOString()}`;

export const dataTypeSerializerEntry1: DatabaseEntry = {
  id: 'c1c5a4bb-1b89-4152-8a60-94aa3268271b',
  title: 'Test Entry',
  database: dataTypeSerializerDatabase.id,
  path: `${dataTypeSerializerDatabase.path}/Test Entry.json`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Title: 'Test Entry',
    Icon: 'content-icon:shapes:blue',
  },
  data: {
    foo: 'bar',
  },
};

export const dataTypeSerializerEntry1FileContents = `{"properties":{"Title":"Test Entry","Icon":"content-icon:shapes:blue"},"data":{"foo":"bar"}}`;

export const dataTypeSerializerEntry1CorePropertiesFileContents = `title: ${dataTypeSerializerEntry1.title}
created: ${dataTypeSerializerEntry1.created.toISOString()}
lastModified: ${dataTypeSerializerEntry1.lastModified.toISOString()}`;

export const databaseEntries = [
  objectEntry1,
  pdfEntry1,
  urlEntry1,
  yamlObjectEntry1,
  dataTypeSerializerEntry1,
];

// File descriptors

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
  // Entry files
  {
    path: objectEntry1.path,
    textContent: objectEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(objectEntry1.path),
    textContent: objectEntry1CorePropertiesFileContents,
  },
  `${pdfDatabase.path}/${pdfEntry1.title}.pdf`,
  {
    path: fileEntryPropertiesFilePath(pdfEntry1.path, 'md'),
    textContent: pdfEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(pdfEntry1.path),
    textContent: pdfEntry1CorePropertiesFileContents,
  },
  {
    path: urlEntry1.path,
    textContent: urlEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(urlEntry1.path),
    textContent: urlEntry1CorePropertiesFileContents,
  },
  {
    path: yamlObjectEntry1.path,
    textContent: yamlObjectEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(yamlObjectEntry1.path),
    textContent: yamlObjectEntry1CorePropertiesFileContents,
  },
  {
    path: dataTypeSerializerEntry1.path,
    textContent: dataTypeSerializerEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(dataTypeSerializerEntry1.path),
    textContent: dataTypeSerializerEntry1CorePropertiesFileContents,
  },
];
