import { BaseItemTypesFixtures } from '@minddrop/base-item-types';
import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import { PropertyType } from '@minddrop/properties';
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
      type: PropertyType.Text,
    },
  ],
};

export const itemTypeConfigs: ItemTypeConfig[] = [markdownItemTypeConfig];

export const markdownItemTypeConfigFileDescriptior: MockFileDescriptor = {
  path: itemTypeConfigFilePath(markdownItemTypeConfig),
  textContent: JSON.stringify(markdownItemTypeConfig, null, 2),
};

export const itemTypeConfigFileDescriptors: MockFileDescriptor[] = [
  markdownItemTypeConfigFileDescriptior,
  {
    path: Fs.concatPath(
      Paths.workspace,
      markdownItemTypeConfig.namePlural,
      '.minddrop',
    ),
  },
];
