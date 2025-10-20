import { BaseItemTypesFixtures } from '@minddrop/base-item-types';
import { BaseDirectory, MockFileDescriptor } from '@minddrop/file-system';
import { PropertyType } from '@minddrop/properties';
import { ItemTypeConfigsDir } from '../constants';
import { ItemTypeConfig } from '../types';

export const markdownItemTypeConfig: ItemTypeConfig = {
  baseType: BaseItemTypesFixtures.markdownBaseItemType.type,
  type: 'Note',
  name: 'Note',
  properties: [
    {
      name: 'foo',
      type: PropertyType.Text,
    },
  ],
};

export const itemTypeConfigs: ItemTypeConfig[] = [markdownItemTypeConfig];

export const markdownItemTypeConfigFileDescriptior: MockFileDescriptor = {
  path: `${ItemTypeConfigsDir}/${markdownItemTypeConfig.type}.json`,
  textContent: JSON.stringify(markdownItemTypeConfig, null, 2),
  options: { baseDir: BaseDirectory.WorkspaceConfig },
};

export const itemTypeConfigFileDescriptors: MockFileDescriptor[] = [
  markdownItemTypeConfigFileDescriptior,
];
