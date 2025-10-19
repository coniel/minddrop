import { i18n } from '@minddrop/i18n';
import { PropertySchema, PropertyType } from '@minddrop/properties';

export const PropertiesDirPath = '.minddrop/properties';

export const ItemCorePropertiesSchema: PropertySchema[] = [
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
