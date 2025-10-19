import {
  PropertyType,
  PropertiesSchema as PropsSchema,
} from '@minddrop/properties';
import { ItemCorePropertiesSchema, PropertiesDirPath } from '../constants';
import { Item, ItemTypeConfig } from '../types';

export const PropertiesSchema: PropsSchema = [
  ...ItemCorePropertiesSchema,
  {
    name: 'foo',
    type: PropertyType.Text,
  },
];

// Paths
export const dataItemsBasePath = 'data';
export const dataPropertiesPath = `${dataItemsBasePath}/${PropertiesDirPath}`;

export const markdownItemsBasePath = 'markdown';
export const markdownPropertiesPath = `${markdownItemsBasePath}/${PropertiesDirPath}`;

/*************************/
/********* Items *********/
/*************************/

// Data items
export const dataItem1: Item = {
  path: `${dataItemsBasePath}/Data Item 1.yaml`,
  dataType: 'data',
  type: 'data',
  properties: {
    title: 'Data Item 1',
    created: new Date('2024-01-01T10:00:00Z'),
    lastModified: new Date('2024-01-02T12:00:00Z'),
    foo: 'Bar',
  },
};

// Markdown items
export const markdownItem1: Item = {
  path: `${dataItemsBasePath}/Markdown Item 1.md`,
  dataType: 'markdown',
  type: 'markdown',
  properties: {
    title: 'Markdown Item 1',
    created: new Date('2024-02-01T10:00:00Z'),
    lastModified: new Date('2024-02-02T12:00:00Z'),
    markdown: '# Markdown Item 1\n\nThis is the first markdown item.',
    foo: 'Bar',
  },
};

export const items: Item[] = [dataItem1, markdownItem1];
export const itemTypeConfigs: ItemTypeConfig[] = [];

export const fileDescriptors = [
  dataItemsBasePath,
  dataPropertiesPath,
  markdownItemsBasePath,
  markdownPropertiesPath,
];
