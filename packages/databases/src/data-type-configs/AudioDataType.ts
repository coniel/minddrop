import { DataType } from '../types';

export const AudioDataType: DataType = {
  type: 'audio',
  name: 'dataTypes.audio.name',
  description: 'dataTypes.audio.description',
  icon: 'content-icon:headphones:default',
  properties: [],
  file: true,
  fileExtensions: ['mp3', 'wav', 'aac', 'ogg'],
};
