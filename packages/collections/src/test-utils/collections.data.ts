import { MockFileDescriptor } from '@minddrop/file-system';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
  CollectionPropertiesDirName,
  CollectionPropertiesDirPath,
  CollectionsConfigDir,
  CollectionsConfigFileName,
} from '../constants';
import {
  Collection,
  CollectionCheckboxPropertySchema,
  CollectionConfig,
  CollectionDatePropertySchema,
  CollectionEntry,
  CollectionEntryProperties,
  CollectionMultiSelectPropertySchema,
  CollectionNumberPropertySchema,
  CollectionPropertyType,
  CollectionSelectPropertySchema,
  CollectionTextPropertySchema,
  CollectionsConfig,
  FileCollectionTypeConfig,
  TextCollectionTypeConfig,
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

export const itemsPropertiesDir = `${itemsCollection.path}/${CollectionConfigDirName}/${CollectionPropertiesDirName}`;
export const notesPropertiesDir = `${notesCollection.path}/${CollectionConfigDirName}/${CollectionPropertiesDirName}`;
export const filesPropertiesDir = `${filesCollection.path}/${CollectionConfigDirName}/${CollectionPropertiesDirName}`;
export const linksPropertiesDir = `${linksCollection.path}/${CollectionConfigDirName}/${CollectionPropertiesDirName}`;

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

export const markdownCollectionTypeConfig: TextCollectionTypeConfig = {
  id: 'markdown',
  type: 'text',
  fileExtension: 'md',
  description: {
    en: {
      name: 'Items',
      details: 'A collection of items',
    },
  },
  coreProperties: [
    {
      type: CollectionPropertyType.Text,
      name: 'note',
      description: 'The main content of the entry in markdown format.',
      defaultValue: '',
    },
  ],
  parse(markdown: string) {
    return {
      note: markdown.replace(/^# .+\n\n/, ''),
      title: markdown.match(/^# (.+)\n\n/)?.[1] || '',
    };
  },
  serialize(properties: CollectionEntryProperties) {
    const { title, note, ...otherProperties } = properties;
    return [`# ${title}\n\n${note || ''}`, otherProperties];
  },
};

export const fileCollectionTypeConfig: FileCollectionTypeConfig = {
  id: 'files',
  type: 'file',
  coreProperties: [
    {
      type: CollectionPropertyType.Text,
      name: 'foo',
      description: 'A sample core property',
    },
  ],
  description: {
    en: {
      name: 'Files',
      details: 'A collection of files',
    },
  },
  fileExtensions: ['pdf'],
};

export const linkCollectionTypeConfig: TextCollectionTypeConfig = {
  id: 'links',
  type: 'text',
  fileExtension: 'json',
  description: {
    en: {
      name: 'Links',
      details: 'A collection of links',
    },
  },
  parse(json: string) {
    return JSON.parse(json);
  },
  serialize(properties: CollectionEntryProperties) {
    return JSON.stringify(properties);
  },
};

export const collectionTypeConfigs = [
  markdownCollectionTypeConfig,
  fileCollectionTypeConfig,
  linkCollectionTypeConfig,
];

/********************************************************/
/****************** Collection Entries ******************/
/********************************************************/

// Notes Collection Entries
export const notesEntry1: CollectionEntry = {
  path: `${notesCollection.path}/Note 1.md`,
  collectionPath: notesCollectionPath,
  properties: {
    title: 'Note 1',
    created: new Date(),
    lastModified: new Date(),
    note: 'This is note 1.',
  },
};

export const notesEntry2: CollectionEntry = {
  path: `${notesCollection.path}/Note 2.md`,
  collectionPath: notesCollectionPath,
  properties: {
    title: 'Note 2',
    created: new Date(),
    lastModified: new Date(),
    note: 'This is note 2.',
  },
};

// Items Collection Entries
export const itemsEntry1: CollectionEntry = {
  path: `${itemsCollection.path}/Entry 1.md`,
  collectionPath: itemsCollectionPath,
  properties: {
    title: 'Entry 1',
    created: new Date(),
    lastModified: new Date(),
    note: '',
    Genre: 'Non-Fiction',
  },
};

export const itemsEntry2: CollectionEntry = {
  path: `${itemsCollection.path}/Entry 2.md`,
  collectionPath: itemsCollectionPath,
  properties: {
    title: 'Entry 2',
    created: new Date(),
    lastModified: new Date(),
    note: '',
    Genre: 'Fiction',
  },
};

export const itemsEntry3: CollectionEntry = {
  path: `${itemsCollection.path}/Entry 3.md`,
  collectionPath: itemsCollectionPath,
  properties: {
    title: 'Entry 3',
    created: new Date(),
    lastModified: new Date(),
    note: '',
    Genre: 'Fiction',
  },
};

// Files Collection Entries
export const filesEntry1: CollectionEntry = {
  path: `${filesCollection.path}/Entry 1.pdf`,
  collectionPath: filesCollectionPath,
  properties: {
    title: 'Entry 1',
    created: new Date(),
    lastModified: new Date(),
    note: null,
  },
};

export const filesEntry2: CollectionEntry = {
  path: `${filesCollection.path}/Entry 2.pdf`,
  collectionPath: filesCollectionPath,
  properties: {
    title: 'Entry 2',
    created: new Date(),
    lastModified: new Date(),
    note: null,
  },
};

export const filesEntry3: CollectionEntry = {
  path: `${filesCollection.path}/Entry 3.pdf`,
  collectionPath: filesCollectionPath,
  properties: {
    title: 'Entry 3',
    created: new Date(),
    lastModified: new Date(),
    note: null,
  },
};

// Links Collection Entries
export const linksEntry1: CollectionEntry = {
  path: `${linksCollection.path}/Entry 1.json`,
  collectionPath: linksCollectionPath,
  properties: {
    title: 'Entry 1',
    created: new Date(),
    lastModified: new Date(),
    note: null,
  },
};

export const linksEntry2: CollectionEntry = {
  path: `${linksCollection.path}/Entry 2.json`,
  collectionPath: linksCollectionPath,
  properties: {
    title: 'Entry 2',
    created: new Date(),
    lastModified: new Date(),
    note: null,
  },
};

export const linksEntry3: CollectionEntry = {
  path: `${linksCollection.path}/Entry 3.json`,
  collectionPath: linksCollectionPath,
  properties: {
    title: 'Entry 3',
    created: new Date(),
    lastModified: new Date(),
    note: null,
  },
};

export const notesEntries = [notesEntry1, notesEntry2];
export const itemsEntries = [itemsEntry1, itemsEntry2, itemsEntry3];
export const filesEntries = [filesEntry1, filesEntry2, filesEntry3];
export const linksEntries = [linksEntry1, linksEntry2, linksEntry3];
export const entries = [
  ...notesEntries,
  ...itemsEntries,
  ...filesEntries,
  ...linksEntries,
];

/************************************************************/
/****************** Collection Entry Files ******************/
/************************************************************/

// Notes Collection Entry Files
export const notesEntry1FileDescriptor: MockFileDescriptor = {
  path: notesEntry1.path,
  textContent: `# ${notesEntry1.properties.title}\n\n${notesEntry1.properties.note}`,
};

export const notesEntry1PropertiesFileDescriptor: MockFileDescriptor = {
  path: `${notesCollectionPath}/${CollectionPropertiesDirPath}/${notesEntry1.properties.title}.json`,
  textContent: JSON.stringify({
    created: notesEntry1.properties.created,
    lastModified: notesEntry1.properties.lastModified,
  }),
};

export const notesEntry2FileDescriptor: MockFileDescriptor = {
  path: notesEntry2.path,
  textContent: `# ${notesEntry2.properties.title}\n\n${notesEntry2.properties.note}`,
};

export const notesEntry2PropertiesFileDescriptor: MockFileDescriptor = {
  path: `${notesCollectionPath}/${CollectionPropertiesDirPath}/${notesEntry2.properties.title}.json`,
  textContent: JSON.stringify({
    created: notesEntry2.properties.created,
    lastModified: notesEntry2.properties.lastModified,
  }),
};

export const notesEntriesFileDescriptors = [
  notesEntry1FileDescriptor,
  notesEntry1PropertiesFileDescriptor,
  notesEntry2FileDescriptor,
  notesEntry2PropertiesFileDescriptor,
];

// Links Collection Entry Files
export const linksEntry1FileDescriptor: MockFileDescriptor = {
  path: linksEntry1.path,
  textContent: JSON.stringify(linksEntry1.properties),
};

export const linksEntry2FileDescriptor: MockFileDescriptor = {
  path: linksEntry2.path,
  textContent: JSON.stringify(linksEntry2.properties),
};

export const linksEntry3FileDescriptor: MockFileDescriptor = {
  path: linksEntry3.path,
  textContent: JSON.stringify(linksEntry3.properties),
};

export const linksEntriesFileDescriptors = [
  linksEntry1FileDescriptor,
  linksEntry2FileDescriptor,
  linksEntry3FileDescriptor,
];

// Files Collection Entry Files
export const filesEntry1FileDescriptor: MockFileDescriptor = {
  path: filesEntry1.path,
};

export const filesEntry1PropertiesFileDescriptor: MockFileDescriptor = {
  path: `${filesCollectionPath}/${CollectionPropertiesDirPath}/${filesEntry1.properties.title}.json`,
  textContent: JSON.stringify({
    created: filesEntry1.properties.created,
    lastModified: filesEntry1.properties.lastModified,
    title: filesEntry1.properties.title,
    note: null,
  }),
};

export const filesEntry2FileDescriptor: MockFileDescriptor = {
  path: filesEntry2.path,
};

export const filesEntry2PropertiesFileDescriptor: MockFileDescriptor = {
  path: `${filesCollectionPath}/${CollectionPropertiesDirPath}/${filesEntry2.properties.title}.json`,
  textContent: JSON.stringify({
    created: filesEntry2.properties.created,
    lastModified: filesEntry2.properties.lastModified,
    title: filesEntry2.properties.title,
    note: null,
  }),
};

export const filesEntry3FileDescriptor: MockFileDescriptor = {
  path: filesEntry3.path,
};

export const filesEntry3PropertiesFileDescriptor: MockFileDescriptor = {
  path: `${filesCollectionPath}/${CollectionPropertiesDirPath}/${filesEntry3.properties.title}.json`,
  textContent: JSON.stringify({
    created: filesEntry3.properties.created,
    lastModified: filesEntry3.properties.lastModified,
    title: filesEntry3.properties.title,
    note: null,
  }),
};

export const filesEntriesFileDescriptors = [
  filesEntry1FileDescriptor,
  filesEntry2FileDescriptor,
  filesEntry3FileDescriptor,
  filesEntry1PropertiesFileDescriptor,
  filesEntry2PropertiesFileDescriptor,
  filesEntry3PropertiesFileDescriptor,
];
