import { BaseItemTypesFixtures } from '@minddrop/base-item-types';
import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { ItemTypeConfig } from '../types';
import { itemTypeConfigFilePath } from '../utils';

export const markdownItemTypeConfig: ItemTypeConfig = {
  baseType: BaseItemTypesFixtures.markdownBaseItemType.type,
  dataType: 'markdown',
  nameSingular: 'Note',
  namePlural: 'Notes',
  icon: 'content-icon:markdown:blue',
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
  baseType: BaseItemTypesFixtures.fileBaseItemType.type,
  dataType: 'pdf',
  nameSingular: 'PDF Document',
  namePlural: 'PDF Documents',
  icon: 'content-icon:file:green',
  color: 'green',
  description: 'A PDF document item type',
  properties: [],
};

export const urlItemTypeConfig: ItemTypeConfig = {
  baseType: BaseItemTypesFixtures.urlBaseItemType.type,
  dataType: 'url',
  nameSingular: 'Web Link',
  namePlural: 'Web Links',
  icon: 'content-icon:link:orange',
  color: 'orange',
  description: 'A web link item type',
  properties: [
    {
      name: 'url',
      type: 'text',
    },
  ],
};

export const itemTypeConfigs: ItemTypeConfig[] = [
  markdownItemTypeConfig,
  pdfItemTypeConfig,
  urlItemTypeConfig,
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

export const itemTypeConfigFileDescriptors: MockFileDescriptor[] = [
  markdownItemTypeConfigFileDescriptior,
  pdfItemTypeConfigFileDescriptor,
  urlItemTypeConfigFileDescriptor,
  {
    path: Fs.concatPath(
      Paths.workspace,
      markdownItemTypeConfig.namePlural,
      '.minddrop',
    ),
  },
];
