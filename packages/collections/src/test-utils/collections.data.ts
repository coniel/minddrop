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
  CollectionCreatedPropertySchema,
  CollectionDatePropertySchema,
  CollectionEntry,
  CollectionLastModifiedPropertySchema,
  CollectionMarkdownPropertySchema,
  CollectionMultiSelectPropertySchema,
  CollectionNumberPropertySchema,
  CollectionPropertyType,
  CollectionSelectPropertySchema,
  CollectionTextPropertySchema,
  CollectionType,
  CollectionTypeConfig,
  CollectionsConfig,
} from '../types';

export const collectionsPath = 'collections';

export const itemsCollectionConfig: CollectionConfig = {
  type: CollectionType.Items,
  created: new Date(),
  lastModified: new Date(),
  name: 'Books',
  itemName: 'Book',
  description: 'A collection of books',
  properties: [],
};

export const notesCollectionConfig: CollectionConfig = {
  type: CollectionType.Notes,

  created: new Date(),
  lastModified: new Date(),
  name: 'Notes',
  itemName: 'Note',
  properties: [],
};

export const fileCollectionConfig: CollectionConfig = {
  type: CollectionType.Files,
  created: new Date(),
  lastModified: new Date(),
  name: 'PDFs',
  itemName: 'PDF',
  properties: [],
};

export const weblinkCollectionConfig: CollectionConfig = {
  type: CollectionType.Weblinks,
  created: new Date(),
  lastModified: new Date(),
  name: 'Bookmarks',
  itemName: 'Bookmark',
  properties: [],
};

export const itemsCollectionPath = `${collectionsPath}/${itemsCollectionConfig.name}`;
export const notesCollectionPath = `${collectionsPath}/${notesCollectionConfig.name}`;
export const fileCollectionPath = `${collectionsPath}/${fileCollectionConfig.name}`;
export const weblinkCollectionPath = `${collectionsPath}/${weblinkCollectionConfig.name}`;

export const itemsCollection: Collection = {
  ...itemsCollectionConfig,
  path: itemsCollectionPath,
};
export const notesCollection: Collection = {
  ...notesCollectionConfig,
  path: notesCollectionPath,
};
export const fileCollection: Collection = {
  ...fileCollectionConfig,
  path: fileCollectionPath,
};
export const weblinkCollection: Collection = {
  ...weblinkCollectionConfig,
  path: weblinkCollectionPath,
};

export const itemsCollectionConfigPath = `${itemsCollectionPath}/${CollectionConfigDirName}/${CollectionConfigFileName}`;
export const notesCollectionConfigPath = `${notesCollectionPath}/${CollectionConfigDirName}/${CollectionConfigFileName}`;
export const fileCollectionConfigPath = `${fileCollectionPath}/${CollectionConfigDirName}/${CollectionConfigFileName}`;
export const weblinkCollectionConfigPath = `${weblinkCollectionPath}/${CollectionConfigDirName}/${CollectionConfigFileName}`;

export const itemsCollectionFileDescriptor: MockFileDescriptor = {
  path: itemsCollectionConfigPath,
  textContent: JSON.stringify(itemsCollectionConfig),
};
export const notesCollectionFileDescriptor: MockFileDescriptor = {
  path: notesCollectionConfigPath,
  textContent: JSON.stringify(notesCollectionConfig),
};
export const fileCollectionFileDescriptor: MockFileDescriptor = {
  path: fileCollectionConfigPath,
  textContent: JSON.stringify(fileCollectionConfig),
};
export const weblinkCollectionFileDescriptor: MockFileDescriptor = {
  path: weblinkCollectionConfigPath,
  textContent: JSON.stringify(weblinkCollectionConfig),
};

export const collections = [
  itemsCollection,
  notesCollection,
  fileCollection,
  weblinkCollection,
];

export const collectionConfigs = [
  itemsCollectionConfig,
  notesCollectionConfig,
  fileCollectionConfig,
  weblinkCollectionConfig,
];

export const collectionFiles = [
  itemsCollectionFileDescriptor,
  notesCollectionFileDescriptor,
  fileCollectionFileDescriptor,
  weblinkCollectionFileDescriptor,
];

export const collectionsConfig: CollectionsConfig = {
  paths: [
    itemsCollectionPath,
    notesCollectionPath,
    fileCollectionPath,
    weblinkCollectionPath,
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

export const createdPropertySchema: CollectionCreatedPropertySchema = {
  type: CollectionPropertyType.Created,
  name: 'Created',
};

export const lastModifiedPropertySchema: CollectionLastModifiedPropertySchema =
  {
    type: CollectionPropertyType.Modified,
    name: 'Last Modified',
  };

export const markdownPropertySchema: CollectionMarkdownPropertySchema = {
  type: CollectionPropertyType.Markdown,
  name: 'Markdown',
};

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
};

export const checkboxPropertySchema: CollectionCheckboxPropertySchema = {
  type: CollectionPropertyType.Checkbox,
  name: 'Checkbox',
  defaultChecked: false,
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

export const itemsCollectionTypeConfig: CollectionTypeConfig = {
  id: 'items',
  description: {
    en: {
      name: 'Items',
      details: 'A collection of items',
    },
  },
  createEntry: async () => entry1,
  getEntry: async () => entry1,
  getAllEntries: async () => entries,
  deleteEntry: async () => {},
  archiveEntry: async () => {},
  setEntryProperties: async () => entry1,
  renameEntry: async () => entry1,
  restoreEntry: async () => entry1,
};

export const collectionTypeConfigs = [itemsCollectionTypeConfig];

/********************************************************/
/****************** Collection Entries ******************/
/********************************************************/

export const entry1: CollectionEntry = {
  title: 'Entry 1',
  path: `${itemsCollectionPath}/Entry 1.md`,
  properties: {},
  metadata: {},
};

export const entry2: CollectionEntry = {
  title: 'Entry 2',
  path: `${itemsCollectionPath}/Entry 2.md`,
  properties: {},
  metadata: {},
};

export const entry3: CollectionEntry = {
  title: 'Entry 3',
  path: `${itemsCollectionPath}/Entry 3.md`,
  properties: {},
  metadata: {},
};

export const entries = [entry1, entry2, entry3];
