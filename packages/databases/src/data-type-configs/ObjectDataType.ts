import { i18n } from '@minddrop/i18n';
import { DataType } from '../types';

export const ObjectDataType: DataType = {
  type: 'object',
  name: i18n.t('databases.object.name'),
  description: i18n.t('databases.object.description'),
  icon: 'content-icon:box:default',
  properties: [],
};
