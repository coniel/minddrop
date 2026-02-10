import { MockFileDescriptor } from '@minddrop/file-system';
import { DatabaseEntry } from '../../types';
import {
  entryCorePropertiesFilePath,
  fileEntryPropertiesFilePath,
} from '../../utils';
import {
  dataTypeSerializerDatabase,
  objectDatabase,
  pdfDatabase,
  urlDatabase,
  yamlObjectDatabase,
} from './databases.fixtures';

/******************************************************************************
 * Object database entries
 *****************************************************************************/

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
Icon: ${objectEntry1.properties.Icon}
---

${objectEntry1.properties.Content}`;

export const objectEntry1CorePropertiesFileContents = `id: ${objectEntry1.id}
title: ${objectEntry1.title}
created: ${objectEntry1.created.toISOString()}
lastModified: ${objectEntry1.lastModified.toISOString()}`;

/******************************************************************************
 * PDF database entries
 *****************************************************************************/

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
---`;

export const pdfEntry1CorePropertiesFileContents = `id: ${pdfEntry1.id}
title: ${pdfEntry1.title}
created: ${pdfEntry1.created.toISOString()}
lastModified: ${pdfEntry1.lastModified.toISOString()}`;

/******************************************************************************
 * YAML object database entries
 *****************************************************************************/

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

export const yamlObjectEntry1FileContents = `Title: Test Entry
Icon: content-icon:shapes:blue`;

export const yamlObjectEntry1CorePropertiesFileContents = `id: ${yamlObjectEntry1.id}
title: ${yamlObjectEntry1.title}
created: ${yamlObjectEntry1.created.toISOString()}
lastModified: ${yamlObjectEntry1.lastModified.toISOString()}`;

/******************************************************************************
 * URL database entries
 *****************************************************************************/

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

export const urlEntry1CorePropertiesFileContents = `id: ${urlEntry1.id}
title: ${urlEntry1.title}
created: ${urlEntry1.created.toISOString()}
lastModified: ${urlEntry1.lastModified.toISOString()}`;

/******************************************************************************
 * Data type serializer database entries
 *****************************************************************************/

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

export const dataTypeSerializerEntry1CorePropertiesFileContents = `id: ${dataTypeSerializerEntry1.id}
title: ${dataTypeSerializerEntry1.title}
created: ${dataTypeSerializerEntry1.created.toISOString()}
lastModified: ${dataTypeSerializerEntry1.lastModified.toISOString()}`;

/******************************************************************************
 * Exports
 *****************************************************************************/

export const databaseEntries = [
  objectEntry1,
  pdfEntry1,
  urlEntry1,
  yamlObjectEntry1,
  dataTypeSerializerEntry1,
];

export const databaseEntryFiles: (MockFileDescriptor | string)[] = [
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
