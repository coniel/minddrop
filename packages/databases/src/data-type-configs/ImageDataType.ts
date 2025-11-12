import { i18n } from '@minddrop/i18n';
import { DataType } from '../types';

export const ImageDataType: DataType = {
  type: 'image',
  name: i18n.t('databases.image.name'),
  description: i18n.t('databases.image.description'),
  icon: 'content-icon:image:default',
  properties: [],
  file: true,
  fileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
};
