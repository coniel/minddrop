import { MockFileDescriptor } from '@minddrop/file-system';
import {
  Properties,
  PropertyType,
  PropertiesSchema as PropsSchema,
} from '@minddrop/properties';
import {
  ConfigDirName,
  ItemCorePropertiesSchema,
  PropertiesDirPath,
} from '../constants';
import {
  AudioItem,
  DataItem,
  FileItem,
  ImageItem,
  MarkdownItem,
  PdfItem,
  TextItem,
  UrlItem,
  VideoItem,
} from '../primitive-item-type-configs';
import { Item, ItemTypeConfig, ItemTypeInstance } from '../types';

export const PropertiesSchema: PropsSchema = [
  ...ItemCorePropertiesSchema,
  {
    name: 'foo',
    type: PropertyType.Text,
  },
];

// Paths
export const dataItemsDir = 'data';
export const dataConfigDir = `${dataItemsDir}/${ConfigDirName}`;
export const dataPropertiesPath = `${dataItemsDir}/${PropertiesDirPath}`;

export const markdownItemsDir = 'markdown';
export const markdownConfigDir = `${markdownItemsDir}/${ConfigDirName}`;
export const markdownPropertiesPath = `${markdownItemsDir}/${PropertiesDirPath}`;

/***************************************/
/*************** Items *****************/
/***************************************/

// Data items
export const dataItem1: Item = {
  id: '7a2acae2-b2f8-460a-820e-c60db442c177',
  path: `${dataItemsDir}/Data Item 1.yaml`,
  type: 'data',
  title: 'Data Item 1',
  created: new Date('2024-01-01T10:00:00Z'),
  lastModified: new Date('2024-01-02T12:00:00Z'),
  properties: {
    foo: 'Bar',
  },
};

// Markdown items
export const markdownItem1: Item = {
  id: '82bd0cf2-c3cf-438a-8dc9-05751aabe30c',
  path: `${dataItemsDir}/Markdown Item 1.md`,
  type: 'markdown',
  title: 'Markdown Item 1',
  created: new Date('2024-02-01T10:00:00Z'),
  lastModified: new Date('2024-02-02T12:00:00Z'),
  properties: {
    markdown: 'This is the first markdown item.',
    foo: 'Bar',
  },
};

export const items: Item[] = [dataItem1, markdownItem1];

/***************************************/
/********* Item Type Instances *********/
/***************************************/

// Data item type instance
export const dataItemTypeInstance: ItemTypeInstance = {
  id: 'fc918b73-39f8-4bd2-81d7-fb745cbd2905',
  path: dataItemsDir,
  type: 'data',
  namePlural: 'Data',
  nameSingular: 'Data entry',
  icon: 'database',
  created: new Date('2024-01-01T10:00:00Z'),
  pathIdMap: new Map([[dataItem1.path, dataItem1.id]]),
  properties: [
    {
      name: 'foo',
      type: PropertyType.Text,
    },
  ],
};

// Markdown item type instance
export const markdownItemTypeInstance: ItemTypeInstance = {
  id: '3b28955a-1ace-433d-a8ac-dd8d09118bd9',
  path: markdownItemsDir,
  type: 'markdown',
  namePlural: 'Notes',
  nameSingular: 'Note',
  created: new Date('2024-02-01T10:00:00Z'),
  pathIdMap: new Map([[markdownItem1.path, markdownItem1.id]]),
  properties: [
    {
      name: 'markdown',
      type: PropertyType.Markdown,
    },
    {
      name: 'foo',
      type: PropertyType.Text,
    },
  ],
};

export const itemTypeInstances: ItemTypeInstance[] = [
  dataItemTypeInstance,
  markdownItemTypeInstance,
];

export const itemTypeConfigs: ItemTypeConfig[] = [
  DataItem,
  MarkdownItem,
  TextItem,
  UrlItem,
  ImageItem,
  VideoItem,
  AudioItem,
  PdfItem,
  FileItem,
];

export const itemsFileDescriptors: MockFileDescriptor[] = [
  // Data item 1
  {
    path: dataItem1.path,
    textContent: Properties.stringify(
      dataItem1.properties,
      dataItemTypeInstance.properties,
    ),
  },
  {
    path: `${dataPropertiesPath}/${dataItem1.id}.json`,
    textContent: Properties.stringify(
      {
        id: dataItem1.id,
        title: dataItem1.title,
        created: dataItem1.created,
        lastModified: dataItem1.lastModified,
      },
      ItemCorePropertiesSchema,
    ),
  },
  // Markdown item 1
  {
    path: markdownItem1.path,
    textContent: markdownItem1.properties.markdown as string,
  },
  {
    path: `${markdownPropertiesPath}/${markdownItem1.id}.json`,
    textContent: Properties.stringify(
      {
        id: markdownItem1.id,
        title: markdownItem1.title,
        created: markdownItem1.created,
        lastModified: markdownItem1.lastModified,
      },
      ItemCorePropertiesSchema,
    ),
  },
];

export const itemTypeInstancesFileDescriptors = [
  dataItemsDir,
  dataPropertiesPath,
  markdownItemsDir,
  markdownPropertiesPath,
];

export const fileDescriptors = [
  ...itemTypeInstancesFileDescriptors,
  ...itemsFileDescriptors,
];
