import { MockFileDescriptor } from '@minddrop/file-system';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
  CollectionsConfigDir,
  CollectionsConfigFileName,
} from '../constants';
import {
  Collection,
  CollectionCheckboxPropertySchema,
  CollectionConfig,
  CollectionDatePropertySchema,
  CollectionEntry,
  CollectionMultiSelectPropertySchema,
  CollectionNumberPropertySchema,
  CollectionPropertyType,
  CollectionSelectPropertySchema,
  CollectionTextPropertySchema,
  CollectionTypeConfig,
  CollectionsConfig,
} from '../types';

export const collectionsPath = 'collections';

export const itemsCollectionConfig: CollectionConfig = {
  type: 'markdown',
  created: new Date(),
  lastModified: new Date(),
  name: 'Books',
  itemName: 'Book',
  description: 'A collection of books',
  properties: [
    {
      type: CollectionPropertyType.Select,
      name: 'Genre',
      defaultValue: 'Non-Fiction',
      options: [
        {
          value: 'Fiction',
          color: 'blue',
        },
        {
          value: 'Non-Fiction',
          color: 'red',
        },
      ],
    },
  ],
};

export const notesCollectionConfig: CollectionConfig = {
  type: 'markdown',
  created: new Date(),
  lastModified: new Date(),
  name: 'Notes',
  itemName: 'Note',
  properties: [],
};

export const filesCollectionConfig: CollectionConfig = {
  type: 'files',
  created: new Date(),
  lastModified: new Date(),
  name: 'PDFs',
  itemName: 'PDF',
  properties: [],
};

export const linksCollectionConfig: CollectionConfig = {
  type: 'links',
  created: new Date(),
  lastModified: new Date(),
  name: 'Bookmarks',
  itemName: 'Bookmark',
  properties: [],
};

export const itemsCollectionPath = `${collectionsPath}/${itemsCollectionConfig.name}`;
export const notesCollectionPath = `${collectionsPath}/${notesCollectionConfig.name}`;
export const filesCollectionPath = `${collectionsPath}/${filesCollectionConfig.name}`;
export const linksCollectionPath = `${collectionsPath}/${linksCollectionConfig.name}`;

export const itemsCollection: Collection = {
  ...itemsCollectionConfig,
  path: itemsCollectionPath,
};
export const notesCollection: Collection = {
  ...notesCollectionConfig,
  path: notesCollectionPath,
};
export const filesCollection: Collection = {
  ...filesCollectionConfig,
  path: filesCollectionPath,
};
export const linksCollection: Collection = {
  ...linksCollectionConfig,
  path: linksCollectionPath,
};

export const itemsCollectionConfigPath = `${itemsCollectionPath}/${CollectionConfigDirName}/${CollectionConfigFileName}`;
export const notesCollectionConfigPath = `${notesCollectionPath}/${CollectionConfigDirName}/${CollectionConfigFileName}`;
export const filesCollectionConfigPath = `${filesCollectionPath}/${CollectionConfigDirName}/${CollectionConfigFileName}`;
export const linksCollectionConfigPath = `${linksCollectionPath}/${CollectionConfigDirName}/${CollectionConfigFileName}`;

export const itemsCollectionFileDescriptor: MockFileDescriptor = {
  path: itemsCollectionConfigPath,
  textContent: JSON.stringify(itemsCollectionConfig),
};
export const notesCollectionFileDescriptor: MockFileDescriptor = {
  path: notesCollectionConfigPath,
  textContent: JSON.stringify(notesCollectionConfig),
};
export const filesCollectionFileDescriptor: MockFileDescriptor = {
  path: filesCollectionConfigPath,
  textContent: JSON.stringify(filesCollectionConfig),
};
export const linksCollectionFileDescriptor: MockFileDescriptor = {
  path: linksCollectionConfigPath,
  textContent: JSON.stringify(linksCollectionConfig),
};

export const collections = [
  itemsCollection,
  notesCollection,
  filesCollection,
  linksCollection,
];

export const collectionConfigs = [
  itemsCollectionConfig,
  notesCollectionConfig,
  filesCollectionConfig,
  linksCollectionConfig,
];

export const collectionFiles = [
  itemsCollectionFileDescriptor,
  notesCollectionFileDescriptor,
  filesCollectionFileDescriptor,
  linksCollectionFileDescriptor,
];

export const collectionsConfig: CollectionsConfig = {
  paths: [
    itemsCollectionPath,
    notesCollectionPath,
    filesCollectionPath,
    linksCollectionPath,
  ],
};

export const collectionsConfigFileDescriptor: MockFileDescriptor = {
  path: CollectionsConfigFileName,
  textContent: JSON.stringify(collectionsConfig),
  options: { baseDir: CollectionsConfigDir },
};

/*********************************************************/
/***************** Collection Properties *****************/
/*********************************************************/

export const textPropertyScehma: CollectionTextPropertySchema = {
  type: CollectionPropertyType.Text,
  name: 'Text',
};

export const numberPropertySchema: CollectionNumberPropertySchema = {
  type: CollectionPropertyType.Number,
  name: 'Number',
};

export const datePropertySchema: CollectionDatePropertySchema = {
  type: CollectionPropertyType.Date,
  name: 'Date',
  locale: 'en-GB',
  format: {
    dateStyle: 'short',
    timeStyle: 'short',
  },
};

export const checkboxPropertySchema: CollectionCheckboxPropertySchema = {
  type: CollectionPropertyType.Checkbox,
  name: 'Checkbox',
  defaultValue: false,
};

export const selectPropertySchema: CollectionSelectPropertySchema = {
  type: CollectionPropertyType.Select,
  name: 'Select',
  options: [
    {
      value: 'Option 1',
      color: 'blue',
    },
    {
      value: 'Option 2',
      color: 'red',
    },
  ],
};

export const multiSelectPropertySchema: CollectionMultiSelectPropertySchema = {
  type: CollectionPropertyType.MultiSelect,
  name: 'MultiSelect',
  options: [
    {
      value: 'Option 1',
      color: 'blue',
    },
    {
      value: 'Option 2',
      color: 'red',
    },
  ],
};

/*********************************************************/
/**************** Collection Type Configs ****************/
/*********************************************************/

export const markdownCollectionTypeConfig: CollectionTypeConfig = {
  id: 'markdown',
  description: {
    en: {
      name: 'Items',
      details: 'A collection of items',
    },
  },
  createEntry: async (_, defaultProperties, metadata) => ({
    ...itemsEntry1,
    properties: defaultProperties,
    metadata,
  }),
  getEntry: async () => itemsEntry1,
  getAllEntries: async () => itemsEntries,
  deleteEntry: async () => {},
  archiveEntry: async () => {},
  updateEntry: async (entry) => entry,
  renameEntry: async () => itemsEntry1,
  restoreEntry: async () => {},
};

export const fileCollectionTypeConfig: CollectionTypeConfig = {
  id: 'files',
  requiredDataType: 'file',
  description: {
    en: {
      name: 'Files',
      details: 'A collection of files',
    },
  },
  createEntry: async () => filesEntry1,
  getEntry: async () => filesEntry1,
  getAllEntries: async () => filesEntries,
  deleteEntry: async () => {},
  archiveEntry: async () => {},
  updateEntry: async () => filesEntry1,
  renameEntry: async () => filesEntry1,
  restoreEntry: async () => {},
};

export const linkCollectionTypeConfig: CollectionTypeConfig = {
  id: 'links',
  requiredDataType: 'url',
  description: {
    en: {
      name: 'Links',
      details: 'A collection of links',
    },
  },
  createEntry: async () => linksEntry1,
  getEntry: async () => linksEntry1,
  getAllEntries: async () => linksEntries,
  deleteEntry: async () => {},
  archiveEntry: async () => {},
  updateEntry: async () => linksEntry1,
  renameEntry: async () => linksEntry1,
  restoreEntry: async () => {},
};

export const collectionTypeConfigs = [
  markdownCollectionTypeConfig,
  fileCollectionTypeConfig,
  linkCollectionTypeConfig,
];

/********************************************************/
/****************** Collection Entries ******************/
/********************************************************/

// Items Collection Entries
export const itemsEntry1: CollectionEntry = {
  title: 'Entry 1',
  path: `${itemsCollection.path}/Entry 1.md`,
  collectionPath: itemsCollectionPath,
  properties: {
    Genre: 'Non-Fiction',
  },
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

export const itemsEntry2: CollectionEntry = {
  title: 'Entry 2',
  path: `${itemsCollection.path}/Entry 2.md`,
  collectionPath: itemsCollectionPath,
  properties: {
    Genre: 'Fiction',
  },
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

export const itemsEntry3: CollectionEntry = {
  title: 'Entry 3',
  path: `${itemsCollection.path}/Entry 3.md`,
  collectionPath: itemsCollectionPath,
  properties: {
    Genre: 'Fiction',
  },
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

// Files Collection Entries
export const filesEntry1: CollectionEntry = {
  title: 'Entry 1',
  path: `${filesCollection.path}/Entry 1.md`,
  collectionPath: filesCollectionPath,
  properties: {},
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

export const filesEntry2: CollectionEntry = {
  title: 'Entry 2',
  path: `${filesCollection.path}/Entry 2.md`,
  collectionPath: filesCollectionPath,
  properties: {},
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

export const filesEntry3: CollectionEntry = {
  title: 'Entry 3',
  path: `${filesCollection.path}/Entry 3.md`,
  collectionPath: filesCollectionPath,
  properties: {},
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

// Links Collection Entries
export const linksEntry1: CollectionEntry = {
  title: 'Entry 1',
  path: `${linksCollection.path}/Entry 1.md`,
  collectionPath: linksCollectionPath,
  properties: {},
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

export const linksEntry2: CollectionEntry = {
  title: 'Entry 2',
  path: `${linksCollection.path}/Entry 2.md`,
  collectionPath: linksCollectionPath,
  properties: {},
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

export const linksEntry3: CollectionEntry = {
  title: 'Entry 3',
  path: `${linksCollection.path}/Entry 3.md`,
  collectionPath: linksCollectionPath,
  properties: {},
  metadata: {
    created: new Date(),
    lastModified: new Date(),
  },
};

export const itemsEntries = [itemsEntry1, itemsEntry2, itemsEntry3];
export const filesEntries = [filesEntry1, filesEntry2, filesEntry3];
export const linksEntries = [linksEntry1, linksEntry2, linksEntry3];
export const entries = [...itemsEntries, ...filesEntries, ...linksEntries];
