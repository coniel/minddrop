import {
  BasicBaseItemTypeConfig,
  PdfBaseItemTypeConfig,
  UrlBaseItemTypeConfig,
} from '@minddrop/base-item-types';
import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { ItemTypeConfig } from '../types';
import { itemTypeConfigFilePath } from '../utils';

export const markdownItemTypeConfig: ItemTypeConfig = {
  baseType: BasicBaseItemTypeConfig.type,
  dataType: BasicBaseItemTypeConfig.dataType,
  nameSingular: 'Note',
  namePlural: 'Notes',
  icon: 'content-icon:book:blue',
  color: 'blue',
  description: 'A markdown note item type',
  properties: [
    {
      name: 'foo',
      type: 'text',
      defaultValue: 'bar',
    },
  ],
};

export const pdfItemTypeConfig: ItemTypeConfig = {
  baseType: PdfBaseItemTypeConfig.type,
  dataType: PdfBaseItemTypeConfig.dataType,
  nameSingular: 'PDF Document',
  namePlural: 'PDF Documents',
  icon: 'content-icon:file:green',
  color: 'green',
  description: 'A PDF document item type',
  properties: [],
};

export const urlItemTypeConfig: ItemTypeConfig = {
  baseType: UrlBaseItemTypeConfig.type,
  dataType: UrlBaseItemTypeConfig.dataType,
  nameSingular: 'Web Link',
  namePlural: 'Web Links',
  icon: 'content-icon:link:orange',
  color: 'orange',
  description: 'A web link item type',
  properties: UrlBaseItemTypeConfig.properties,
};

export const noPropertiesItemTypeConfig: ItemTypeConfig = {
  baseType: BasicBaseItemTypeConfig.type,
  dataType: BasicBaseItemTypeConfig.dataType,
  nameSingular: 'No property',
  namePlural: 'No properties',
  icon: 'content-icon:box:gray',
  color: 'gray',
  description: 'An item type with no properties',
  properties: [],
};

export const itemTypeConfigs: ItemTypeConfig[] = [
  markdownItemTypeConfig,
  pdfItemTypeConfig,
  urlItemTypeConfig,
  noPropertiesItemTypeConfig,
];

export const markdownItemTypeConfigFileDescriptior: MockFileDescriptor = {
  path: itemTypeConfigFilePath(markdownItemTypeConfig),
  textContent: JSON.stringify(markdownItemTypeConfig, null, 2),
};

export const pdfItemTypeConfigFileDescriptor: MockFileDescriptor = {
  path: itemTypeConfigFilePath(pdfItemTypeConfig),
  textContent: JSON.stringify(pdfItemTypeConfig, null, 2),
};

export const urlItemTypeConfigFileDescriptor: MockFileDescriptor = {
  path: itemTypeConfigFilePath(urlItemTypeConfig),
  textContent: JSON.stringify(urlItemTypeConfig, null, 2),
};

export const noPropertiesItemTypeConfigFileDescriptor: MockFileDescriptor = {
  path: itemTypeConfigFilePath(noPropertiesItemTypeConfig),
  textContent: JSON.stringify(noPropertiesItemTypeConfig, null, 2),
};

export const itemTypeConfigFileDescriptors: MockFileDescriptor[] = [
  markdownItemTypeConfigFileDescriptior,
  pdfItemTypeConfigFileDescriptor,
  urlItemTypeConfigFileDescriptor,
  noPropertiesItemTypeConfigFileDescriptor,
  {
    path: Fs.concatPath(
      Paths.workspace,
      markdownItemTypeConfig.namePlural,
      '.minddrop',
    ),
  },
];
