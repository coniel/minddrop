import { MockFileDescriptor } from '@minddrop/file-system';
import { DatabaseEntry } from '../../types';
import { entryCorePropertiesFilePath } from '../../utils';
import {
  objectDatabase,
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
 * Exports
 *****************************************************************************/

export const databaseEntries = [objectEntry1, urlEntry1, yamlObjectEntry1];

export const databaseEntryFiles: (MockFileDescriptor | string)[] = [
  {
    path: objectEntry1.path,
    textContent: objectEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(objectEntry1.path),
    textContent: objectEntry1CorePropertiesFileContents,
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
];
