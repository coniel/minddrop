import { MockFileDescriptor } from '@minddrop/file-system';
import { DatabaseEntry } from '../../types';
import {
  collectionDatabase,
  commonStorageDatabase,
  entryStorageDatabase,
  objectDatabase,
  propertyStorageDatabase,
  rootStorageDatabase,
  timestampDatabase,
  urlDatabase,
  yamlObjectDatabase,
} from './databases.fixtures';

/******************************************************************************
 * Object database entries
 *****************************************************************************/

export const objectEntry1: DatabaseEntry = {
  id: `${objectDatabase.name}/Test Entry.md`,
  title: 'Test Entry',
  database: objectDatabase.id,
  path: `${objectDatabase.path}/Test Entry.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Content: 'Test content',
    Icon: 'content-icon:shapes:blue',
  },
  metadata: {},
};

export const objectEntry1FileContents = `---
Icon: ${objectEntry1.properties.Icon}
---

${objectEntry1.properties.Content}`;

/******************************************************************************
 * YAML object database entries
 *****************************************************************************/

export const yamlObjectEntry1: DatabaseEntry = {
  id: `${yamlObjectDatabase.name}/Test Entry.yaml`,
  title: 'Test Entry',
  database: yamlObjectDatabase.id,
  path: `${yamlObjectDatabase.path}/Test Entry.yaml`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Title: 'Test Entry',
    Icon: 'content-icon:shapes:blue',
  },
  metadata: {},
};

export const yamlObjectEntry1FileContents = `Title: Test Entry
Icon: content-icon:shapes:blue`;

/******************************************************************************
 * URL database entries
 *****************************************************************************/

export const urlEntry1: DatabaseEntry = {
  id: `${urlDatabase.name}/Test Entry.md`,
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
  metadata: {},
};

export const urlEntry1FileContents = `---
URL: https://example.com/some-page
Title: Test Entry
Description: Test description
Image: image.png
Icon: icon.png
---`;

/******************************************************************************
 * Root storage database entries
 *****************************************************************************/

export const rootStorageEntry1: DatabaseEntry = {
  id: `${rootStorageDatabase.name}/Root Storage Entry 1.md`,
  title: 'Root Storage Entry 1',
  database: rootStorageDatabase.id,
  path: `${rootStorageDatabase.path}/Root Storage Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'image.png',
  },
  metadata: {},
};

export const rootStorageEntry1FileContents = `---
Image: image.png
---`;

export const rootStorageEntry_empty_value: DatabaseEntry = {
  id: `${rootStorageDatabase.name}/Root Storage Entry Empty Value.md`,
  title: 'Root Storage Entry Empty Value',
  database: rootStorageDatabase.id,
  path: `${rootStorageDatabase.path}/Root Storage Entry Empty Value.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {},
  metadata: {},
};

export const rootStorageEntry_empty_valueFileContents = `---
---`;

/******************************************************************************
 * Common storage database entries
 *****************************************************************************/

export const commonStorageEntry1: DatabaseEntry = {
  id: `${commonStorageDatabase.name}/Common Storage Entry 1.md`,
  title: 'Common Storage Entry 1',
  database: commonStorageDatabase.id,
  path: `${commonStorageDatabase.path}/Common Storage Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'image.png',
  },
  metadata: {},
};

export const commonStorageEntry1FileContents = `---
Image: image.png
---`;

/******************************************************************************
 * Property storage database entries
 *****************************************************************************/

export const propertyStorageEntry1: DatabaseEntry = {
  id: `${propertyStorageDatabase.name}/Property Storage Entry 1.md`,
  title: 'Property Storage Entry 1',
  database: propertyStorageDatabase.id,
  path: `${propertyStorageDatabase.path}/Property Storage Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'image.png',
  },
  metadata: {},
};

export const propertyStorageEntry1FileContents = `---
Image: image.png
---`;

/******************************************************************************
 * Entry storage database entries
 *****************************************************************************/

export const entryStorageEntry1: DatabaseEntry = {
  id: `${entryStorageDatabase.name}/Entry Storage Entry 1/Entry Storage Entry 1.md`,
  title: 'Entry Storage Entry 1',
  database: entryStorageDatabase.id,
  path: `${entryStorageDatabase.path}/Entry Storage Entry 1/Entry Storage Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'image.png',
  },
  metadata: {},
};

export const entryStorageEntry1FileContents = `---
Image: image.png
---`;

/******************************************************************************
 * Timestamp database entries
 *****************************************************************************/

export const timestampEntry1: DatabaseEntry = {
  id: `${timestampDatabase.name}/Timestamp Entry.md`,
  title: 'Timestamp Entry',
  database: timestampDatabase.id,
  path: `${timestampDatabase.path}/Timestamp Entry.md`,
  created: new Date('2025-06-15T10:00:00.000Z'),
  lastModified: new Date('2025-06-20T14:00:00.000Z'),
  properties: {
    Created: new Date('2025-06-15T10:00:00.000Z'),
    'Last Modified': new Date('2025-06-20T14:00:00.000Z'),
  },
  metadata: {},
};

export const timestampEntry1FileContents = `---
Created: ${(timestampEntry1.properties.Created as Date).toISOString()}
Last Modified: ${(timestampEntry1.properties['Last Modified'] as Date).toISOString()}
---`;

/******************************************************************************
 * Collection database entries
 *****************************************************************************/

export const collectionEntry1: DatabaseEntry = {
  id: `${collectionDatabase.name}/Collection Entry 1.md`,
  title: 'Collection Entry 1',
  database: collectionDatabase.id,
  path: `${collectionDatabase.path}/Collection Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Title: 'Collection Entry 1',
    Related: ['related-entry-1', 'related-entry-2'],
    References: ['reference-entry-1'],
  },
  metadata: {},
};

export const collectionEntry1FileContents = `---
Title: Collection Entry 1
Related:
  - related-entry-1
  - related-entry-2
References:
  - reference-entry-1
---`;

export const databaseEntries = [
  objectEntry1,
  urlEntry1,
  yamlObjectEntry1,
  rootStorageEntry1,
  rootStorageEntry_empty_value,
  commonStorageEntry1,
  propertyStorageEntry1,
  entryStorageEntry1,
  collectionEntry1,
  timestampEntry1,
];

export const databaseEntryFiles: (MockFileDescriptor | string)[] = [
  {
    path: objectEntry1.path,
    textContent: objectEntry1FileContents,
  },
  {
    path: urlEntry1.path,
    textContent: urlEntry1FileContents,
  },
  {
    path: yamlObjectEntry1.path,
    textContent: yamlObjectEntry1FileContents,
  },
  {
    path: rootStorageEntry1.path,
    textContent: rootStorageEntry1FileContents,
  },
  {
    path: rootStorageEntry_empty_value.path,
    textContent: rootStorageEntry_empty_valueFileContents,
  },
  {
    path: commonStorageEntry1.path,
    textContent: commonStorageEntry1FileContents,
  },
  {
    path: propertyStorageEntry1.path,
    textContent: propertyStorageEntry1FileContents,
  },
  {
    path: entryStorageEntry1.path,
    textContent: entryStorageEntry1FileContents,
  },
  {
    path: collectionEntry1.path,
    textContent: collectionEntry1FileContents,
  },
  {
    path: timestampEntry1.path,
    textContent: timestampEntry1FileContents,
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
