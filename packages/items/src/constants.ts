import { i18n } from '@minddrop/i18n';
import { PropertySchema, PropertyType } from '@minddrop/properties';

export const ConfigDirName = '.minddrop';
export const PropertiesDirName = 'properties';
export const AssetsDirName = 'assets';
export const PropertiesDirPath = `${ConfigDirName}/${PropertiesDirName}`;
export const AssetsDirPath = `${ConfigDirName}/${AssetsDirName}`;

export const ItemCorePropertiesSchema: PropertySchema[] = [
  {
    name: 'id',
    type: PropertyType.Text,
  },
  {
    name: 'type',
    type: PropertyType.Text,
  },
  {
    name: 'title',
    type: PropertyType.Text,
    defaultValue: i18n.t('labels.untitled'),
  },
  {
    name: 'created',
    type: PropertyType.Date,
    defaultValue: 'now',
  },
  {
    name: 'lastModified',
    type: PropertyType.Date,
    defaultValue: 'now',
  },
];
