import { i18n } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';

export const ConfigDirName = '.minddrop';
export const PropertiesDirName = 'properties';
export const AssetsDirName = 'assets';
export const PropertiesDirPath = `${ConfigDirName}/${PropertiesDirName}`;
export const AssetsDirPath = `${ConfigDirName}/${AssetsDirName}`;

export const ItemCorePropertiesSchema: PropertySchema[] = [
  {
    name: 'id',
    type: 'text',
  },
  {
    name: 'type',
    type: 'text',
  },
  {
    name: 'title',
    type: 'text',
    defaultValue: i18n.t('labels.untitled'),
  },
  {
    name: 'created',
    type: 'date',
    defaultValue: 'now',
  },
  {
    name: 'lastModified',
    type: 'date',
    defaultValue: 'now',
  },
];
