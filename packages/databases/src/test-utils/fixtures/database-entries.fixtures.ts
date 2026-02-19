import { MockFileDescriptor } from '@minddrop/file-system';
import { DatabaseEntry } from '../../types';
import { entryCorePropertiesFilePath } from '../../utils';
import {
  commonStorageDatabase,
  entryStorageDatabase,
  objectDatabase,
  propertyStorageDatabase,
  rootStorageDatabase,
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
 * Root storage database entries
 *****************************************************************************/

export const rootStorageEntry1: DatabaseEntry = {
  id: 'root-storage-entry-1',
  title: 'Root Storage Entry 1',
  database: rootStorageDatabase.id,
  path: `${rootStorageDatabase.path}/Root Storage Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'image.png',
  },
};

export const rootStorageEntry1FileContents = `---
Image: image.png
---`;

export const rootStorageEntry1CorePropertiesFileContents = `id: ${rootStorageEntry1.id}
title: ${rootStorageEntry1.title}
created: ${rootStorageEntry1.created.toISOString()}
lastModified: ${rootStorageEntry1.lastModified.toISOString()}`;

export const rootStorageEntry_empty_value: DatabaseEntry = {
  id: 'root-storage-entry-empty-value',
  title: 'Root Storage Entry Empty Value',
  database: rootStorageDatabase.id,
  path: `${rootStorageDatabase.path}/Root Storage Entry Empty Value.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {},
};

export const rootStorageEntry_empty_valueFileContents = `---
---`;

export const rootStorageEntry_empty_valueCorePropertiesFileContents = `id: ${rootStorageEntry_empty_value.id}
title: ${rootStorageEntry_empty_value.title}
created: ${rootStorageEntry_empty_value.created.toISOString()}
lastModified: ${rootStorageEntry_empty_value.lastModified.toISOString()}`;

/******************************************************************************
 * Common storage database entries
 *****************************************************************************/

export const commonStorageEntry1: DatabaseEntry = {
  id: 'common-storage-entry-1',
  title: 'Common Storage Entry 1',
  database: commonStorageDatabase.id,
  path: `${commonStorageDatabase.path}/Common Storage Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'image.png',
  },
};

export const commonStorageEntry1FileContents = `---
Image: image.png
---`;

export const commonStorageEntry1CorePropertiesFileContents = `id: ${commonStorageEntry1.id}
title: ${commonStorageEntry1.title}
created: ${commonStorageEntry1.created.toISOString()}
lastModified: ${commonStorageEntry1.lastModified.toISOString()}`;

/******************************************************************************
 * Property storage database entries
 *****************************************************************************/

export const propertyStorageEntry1: DatabaseEntry = {
  id: 'property-storage-entry-1',
  title: 'Property Storage Entry 1',
  database: propertyStorageDatabase.id,
  path: `${propertyStorageDatabase.path}/Property Storage Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'image.png',
  },
};

export const propertyStorageEntry1FileContents = `---
Image: image.png
---`;

export const propertyStorageEntry1CorePropertiesFileContents = `id: ${propertyStorageEntry1.id}
title: ${propertyStorageEntry1.title}
created: ${propertyStorageEntry1.created.toISOString()}
lastModified: ${propertyStorageEntry1.lastModified.toISOString()}`;

/******************************************************************************
 * Entry storage database entries
 *****************************************************************************/

export const entryStorageEntry1: DatabaseEntry = {
  id: 'entry-storage-entry-1',
  title: 'Entry Storage Entry 1',
  database: entryStorageDatabase.id,
  path: `${entryStorageDatabase.path}/Entry Storage Entry 1/Entry Storage Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'image.png',
  },
};

export const entryStorageEntry1FileContents = `---
Image: image.png
---`;

export const entryStorageEntry1CorePropertiesFileContents = `id: ${entryStorageEntry1.id}
title: ${entryStorageEntry1.title}
created: ${entryStorageEntry1.created.toISOString()}
lastModified: ${entryStorageEntry1.lastModified.toISOString()}`;

/******************************************************************************
 * Exports
 *****************************************************************************/

export const databaseEntries = [
  objectEntry1,
  urlEntry1,
  yamlObjectEntry1,
  rootStorageEntry1,
  rootStorageEntry_empty_value,
  commonStorageEntry1,
  propertyStorageEntry1,
  entryStorageEntry1,
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
    path: rootStorageEntry1.path,
    textContent: rootStorageEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(rootStorageEntry1.path),
    textContent: rootStorageEntry1CorePropertiesFileContents,
  },
  {
    path: rootStorageEntry_empty_value.path,
    textContent: rootStorageEntry_empty_valueFileContents,
  },
  {
    path: entryCorePropertiesFilePath(rootStorageEntry_empty_value.path),
    textContent: rootStorageEntry_empty_valueCorePropertiesFileContents,
  },
  {
    path: commonStorageEntry1.path,
    textContent: commonStorageEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(commonStorageEntry1.path),
    textContent: commonStorageEntry1CorePropertiesFileContents,
  },
  {
    path: propertyStorageEntry1.path,
    textContent: propertyStorageEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(propertyStorageEntry1.path),
    textContent: propertyStorageEntry1CorePropertiesFileContents,
  },
  {
    path: entryStorageEntry1.path,
    textContent: entryStorageEntry1FileContents,
  },
  {
    path: entryCorePropertiesFilePath(entryStorageEntry1.path),
    textContent: entryStorageEntry1CorePropertiesFileContents,
  },
];

export const databaseEntryPropertyFiles: (MockFileDescriptor | string)[] = [
  // Root storage
  `${rootStorageDatabase.path}/image.png`,
  // Common storage
  `${commonStorageDatabase.path}/${commonStorageDatabase.propertyFilesDir}/image.png`,
  // Property storage
  `${propertyStorageDatabase.path}/Image/image.png`,
  // Entry storage
  `${entryStorageDatabase.path}/${entryStorageEntry1.title}/image.png`,
];
