import { MockFileDescriptor } from '@minddrop/file-system';
import { DatabaseEntry, SqlEntryRecord } from '../../types';
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
  id: 'database-entry_object-entry-1',
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

export const objectEntry1SqlRecord: SqlEntryRecord = {
  id: objectEntry1.id,
  databaseId: objectDatabase.id,
  path: objectEntry1.path,
  title: 'Test Entry',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [
    { name: 'Content', type: 'formatted-text', value: 'Test content' },
    { name: 'Icon', type: 'icon', value: 'content-icon:shapes:blue' },
  ],
};

/******************************************************************************
 * YAML object database entries
 *****************************************************************************/

export const yamlObjectEntry1: DatabaseEntry = {
  id: 'database-entry_yaml-object-entry-1',
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

export const yamlObjectEntry1SqlRecord: SqlEntryRecord = {
  id: yamlObjectEntry1.id,
  databaseId: yamlObjectDatabase.id,
  path: yamlObjectEntry1.path,
  title: 'Test Entry',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [
    { name: 'Title', type: 'text', value: 'Test Entry' },
    { name: 'Icon', type: 'icon', value: 'content-icon:shapes:blue' },
  ],
};

/******************************************************************************
 * URL database entries
 *****************************************************************************/

export const urlEntry1: DatabaseEntry = {
  id: 'database-entry_url-entry-1',
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

export const urlEntry1SqlRecord: SqlEntryRecord = {
  id: urlEntry1.id,
  databaseId: urlDatabase.id,
  path: urlEntry1.path,
  title: 'Test Entry',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [
    { name: 'URL', type: 'url', value: 'https://example.com/some-page' },
  ],
};

/******************************************************************************
 * Root storage database entries
 *****************************************************************************/

export const rootStorageEntry1: DatabaseEntry = {
  id: 'database-entry_root-storage-entry-1',
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

export const rootStorageEntry1SqlRecord: SqlEntryRecord = {
  id: rootStorageEntry1.id,
  databaseId: rootStorageDatabase.id,
  path: rootStorageEntry1.path,
  title: 'Root Storage Entry 1',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [{ name: 'Image', type: 'image', value: 'image.png' }],
};

export const referenceEntry1: DatabaseEntry = {
  id: 'database-entry_reference-entry-1',
  title: 'Reference Entry 1',
  database: rootStorageDatabase.id,
  path: `${rootStorageDatabase.path}/Reference Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Image: 'reference.png',
  },
  metadata: {},
};

export const referenceEntry1FileContents = `---
Image: reference.png
---`;

export const referenceEntry1SqlRecord: SqlEntryRecord = {
  id: referenceEntry1.id,
  databaseId: rootStorageDatabase.id,
  path: referenceEntry1.path,
  title: 'Reference Entry 1',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [{ name: 'Image', type: 'image', value: 'reference.png' }],
};

export const rootStorageEntry_empty_value: DatabaseEntry = {
  id: 'database-entry_root-storage-entry-empty-value',
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

export const rootStorageEntrySqlRecord_empty_value: SqlEntryRecord = {
  id: rootStorageEntry_empty_value.id,
  databaseId: rootStorageDatabase.id,
  path: rootStorageEntry_empty_value.path,
  title: 'Root Storage Entry Empty Value',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [],
};

/******************************************************************************
 * Common storage database entries
 *****************************************************************************/

export const commonStorageEntry1: DatabaseEntry = {
  id: 'database-entry_common-storage-entry-1',
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

export const commonStorageEntry1SqlRecord: SqlEntryRecord = {
  id: commonStorageEntry1.id,
  databaseId: commonStorageDatabase.id,
  path: commonStorageEntry1.path,
  title: 'Common Storage Entry 1',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [{ name: 'Image', type: 'image', value: 'image.png' }],
};

/******************************************************************************
 * Property storage database entries
 *****************************************************************************/

export const propertyStorageEntry1: DatabaseEntry = {
  id: 'database-entry_property-storage-entry-1',
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

export const propertyStorageEntry1SqlRecord: SqlEntryRecord = {
  id: propertyStorageEntry1.id,
  databaseId: propertyStorageDatabase.id,
  path: propertyStorageEntry1.path,
  title: 'Property Storage Entry 1',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [{ name: 'Image', type: 'image', value: 'image.png' }],
};

/******************************************************************************
 * Entry storage database entries
 *****************************************************************************/

export const entryStorageEntry1: DatabaseEntry = {
  id: 'database-entry_entry-storage-entry-1',
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

export const entryStorageEntry1SqlRecord: SqlEntryRecord = {
  id: entryStorageEntry1.id,
  databaseId: entryStorageDatabase.id,
  path: entryStorageEntry1.path,
  title: 'Entry Storage Entry 1',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [{ name: 'Image', type: 'image', value: 'image.png' }],
};

/******************************************************************************
 * Timestamp database entries
 *****************************************************************************/

export const timestampEntry1: DatabaseEntry = {
  id: 'database-entry_timestamp-entry-1',
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

export const timestampEntry1SqlRecord: SqlEntryRecord = {
  id: timestampEntry1.id,
  databaseId: timestampDatabase.id,
  path: timestampEntry1.path,
  title: 'Timestamp Entry',
  created: 1749981600000,
  lastModified: 1750428000000,
  metadata: '{}',
  properties: [
    { name: 'Created', type: 'created', value: 1749981600000 },
    { name: 'Last Modified', type: 'last-modified', value: 1750428000000 },
  ],
};

/******************************************************************************
 * Collection database entries
 *****************************************************************************/

export const relatedEntry1: DatabaseEntry = {
  id: 'database-entry_related-entry-1',
  title: 'Related Entry 1',
  database: collectionDatabase.id,
  path: `${collectionDatabase.path}/Related Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Title: 'Related Entry 1',
    Related: [],
    References: [],
  },
  metadata: {},
};

export const relatedEntry1FileContents = `---
Title: Related Entry 1
Related: []
References: []
---`;

export const relatedEntry1SqlRecord: SqlEntryRecord = {
  id: relatedEntry1.id,
  databaseId: collectionDatabase.id,
  path: relatedEntry1.path,
  title: 'Related Entry 1',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [
    { name: 'Title', type: 'text', value: 'Related Entry 1' },
    { name: 'Related', type: 'collection', value: [] },
    { name: 'References', type: 'collection', value: [] },
  ],
};

export const relatedEntry2: DatabaseEntry = {
  id: 'database-entry_related-entry-2',
  title: 'Related Entry 2',
  database: collectionDatabase.id,
  path: `${collectionDatabase.path}/Related Entry 2.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Title: 'Related Entry 2',
    Related: [],
    References: [],
  },
  metadata: {},
};

export const relatedEntry2FileContents = `---
Title: Related Entry 2
Related: []
References: []
---`;

export const relatedEntry2SqlRecord: SqlEntryRecord = {
  id: relatedEntry2.id,
  databaseId: collectionDatabase.id,
  path: relatedEntry2.path,
  title: 'Related Entry 2',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [
    { name: 'Title', type: 'text', value: 'Related Entry 2' },
    { name: 'Related', type: 'collection', value: [] },
    { name: 'References', type: 'collection', value: [] },
  ],
};

export const collectionEntry1: DatabaseEntry = {
  id: 'database-entry_collection-entry-1',
  title: 'Collection Entry 1',
  database: collectionDatabase.id,
  path: `${collectionDatabase.path}/Collection Entry 1.md`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  properties: {
    Title: 'Collection Entry 1',
    Related: [relatedEntry1.id, relatedEntry2.id],
    References: [referenceEntry1.id],
  },
  metadata: {},
};

export const collectionEntry1FileContents = `---
Title: Collection Entry 1
Related:
  - Collection Database/Related Entry 1.md
  - Collection Database/Related Entry 2.md
References:
  - Root Storage Database/Reference Entry 1.md
---`;

export const collectionEntry1SqlRecord: SqlEntryRecord = {
  id: collectionEntry1.id,
  databaseId: collectionDatabase.id,
  path: collectionEntry1.path,
  title: 'Collection Entry 1',
  created: 1704067200000,
  lastModified: 1704067200000,
  metadata: '{}',
  properties: [
    { name: 'Title', type: 'text', value: 'Collection Entry 1' },
    {
      name: 'Related',
      type: 'collection',
      value: [relatedEntry1.id, relatedEntry2.id],
    },
    { name: 'References', type: 'collection', value: [referenceEntry1.id] },
  ],
};

/******************************************************************************
 * Aggregate arrays
 *****************************************************************************/

export const databaseEntries = [
  objectEntry1,
  urlEntry1,
  yamlObjectEntry1,
  rootStorageEntry1,
  referenceEntry1,
  rootStorageEntry_empty_value,
  commonStorageEntry1,
  propertyStorageEntry1,
  entryStorageEntry1,
  relatedEntry1,
  relatedEntry2,
  collectionEntry1,
  timestampEntry1,
];

export const databaseEntrySqlRecords: SqlEntryRecord[] = [
  objectEntry1SqlRecord,
  urlEntry1SqlRecord,
  yamlObjectEntry1SqlRecord,
  rootStorageEntry1SqlRecord,
  referenceEntry1SqlRecord,
  rootStorageEntrySqlRecord_empty_value,
  commonStorageEntry1SqlRecord,
  propertyStorageEntry1SqlRecord,
  entryStorageEntry1SqlRecord,
  relatedEntry1SqlRecord,
  relatedEntry2SqlRecord,
  collectionEntry1SqlRecord,
  timestampEntry1SqlRecord,
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
    path: referenceEntry1.path,
    textContent: referenceEntry1FileContents,
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
    path: relatedEntry1.path,
    textContent: relatedEntry1FileContents,
  },
  {
    path: relatedEntry2.path,
    textContent: relatedEntry2FileContents,
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
