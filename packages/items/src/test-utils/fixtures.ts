import { MockFileDescriptor } from '@minddrop/file-system';
import { ItemTypesFixtures } from '@minddrop/item-types';
import { Markdown } from '@minddrop/markdown';
import {
  Properties,
  PropertiesSchema as PropsSchema,
} from '@minddrop/properties';
import {
  ConfigDirName,
  ItemCorePropertiesSchema,
  PropertiesDirName,
  PropertiesDirPath,
} from '../constants';
import { Item } from '../types';
import {
  itemCoreProperties,
  itemCorePropertiesFilePath,
  itemUserPropertiesFilePath,
} from '../utils';

export const PropertiesSchema: PropsSchema = [
  ...ItemCorePropertiesSchema,
  {
    name: 'foo',
    type: 'text',
  },
];

const { markdownItemTypeConfig, pdfItemTypeConfig, urlItemTypeConfig } =
  ItemTypesFixtures;

// Paths
export const markdownItemsDir = `workspace/${markdownItemTypeConfig.namePlural}`;
export const markdownConfigDir = `${markdownItemsDir}/${ConfigDirName}`;
export const markdownCorePropertiesPath = `${markdownItemsDir}/${PropertiesDirPath}`;

export const pdfItemsDir = `workspace/${pdfItemTypeConfig.namePlural}`;
export const pdfConfigDir = `${pdfItemsDir}/${ConfigDirName}`;
export const pdfCorePropertiesPath = `${pdfConfigDir}/${PropertiesDirPath}`;
export const pdfUserPropertiesPath = `${pdfItemsDir}/${PropertiesDirName}`;

export const urlItemsDir = `workspace/${urlItemTypeConfig.namePlural}`;
export const urlConfigDir = `${urlItemsDir}/${ConfigDirName}`;
export const urlCorePropertiesPath = `${urlConfigDir}/${PropertiesDirPath}`;

/***************************************/
/*************** Items *****************/
/***************************************/

// Markdown items
export const markdownItem1: Item = {
  path: `${markdownItemsDir}/Markdown Item 1.md`,
  type: markdownItemTypeConfig.nameSingular,
  title: 'Markdown Item 1',
  created: new Date('2024-02-01T10:00:00Z'),
  lastModified: new Date('2024-02-02T12:00:00Z'),
  markdown: 'This is the first markdown item.',
  properties: {
    foo: 'Bar',
  },
};

// PDF items
export const pdfItem1: Item = {
  path: `${pdfItemsDir}/PDF Item 1.pdf`,
  type: pdfItemTypeConfig.nameSingular,
  title: 'PDF Item 1',
  created: new Date('2024-03-01T10:00:00Z'),
  lastModified: new Date('2024-03-02T12:00:00Z'),
  markdown: 'This is the first PDF item.',
  properties: {
    foo: 'Bar',
  },
};

// URL items
export const urlItem1: Item = {
  path: `${urlItemsDir}/URL Item 1.md`,
  type: urlItemTypeConfig.nameSingular,
  title: 'URL Item 1',
  created: new Date('2024-04-01T10:00:00Z'),
  lastModified: new Date('2024-04-02T12:00:00Z'),
  markdown: 'This is the first URL item.',
  properties: {
    url: 'https://example.com',
  },
};

export const items: Item[] = [markdownItem1, pdfItem1];

export const itemsFileDescriptors: MockFileDescriptor[] = [
  // Markdown item 1
  {
    path: markdownItem1.path,
    textContent: `---\n${Properties.stringify(markdownItem1.properties)}\n---\n\n${markdownItem1.markdown}`,
  },
  {
    path: itemCorePropertiesFilePath(markdownItem1.path),
    textContent: Properties.stringify(itemCoreProperties(markdownItem1)),
  },
  // PDF item 1
  {
    path: pdfItem1.path,
    textContent: pdfItem1.properties.markdown as string,
  },
  {
    path: itemCorePropertiesFilePath(pdfItem1.path),
    textContent: Properties.stringify(itemCoreProperties(pdfItem1)),
  },
  {
    path: itemUserPropertiesFilePath(pdfItem1.path),
    textContent: Markdown.setProperties(pdfItem1.markdown, pdfItem1.properties),
  },
  // URL item 1
  {
    path: urlItem1.path,
    textContent: urlItem1.properties.markdown as string,
  },
  {
    path: itemCorePropertiesFilePath(urlItem1.path),
    textContent: Properties.stringify(itemCoreProperties(urlItem1)),
  },
];

export const itemTypeInstancesFileDescriptors = [
  markdownItemsDir,
  markdownCorePropertiesPath,
  pdfItemsDir,
  pdfCorePropertiesPath,
  pdfUserPropertiesPath,
  urlItemsDir,
  urlCorePropertiesPath,
];

export const fileDescriptors = [
  ...itemTypeInstancesFileDescriptors,
  ...itemsFileDescriptors,
];
