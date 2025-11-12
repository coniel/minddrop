import { i18n } from '@minddrop/i18n';
import { DataType } from '../types';

export const FileDataType: DataType = {
  type: 'file',
  name: i18n.t('databases.file.name'),
  description: i18n.t('databases.file.description'),
  icon: 'content-icon:file-box:default',
  properties: [],
  file: true,
};
