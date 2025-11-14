import { DataType } from '../types';

export const ImageDataType: DataType = {
  type: 'image',
  name: 'dataTypes.image.name',
  description: 'dataTypes.image.description',
  icon: 'content-icon:image:default',
  properties: [],
  file: true,
  fileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
};
