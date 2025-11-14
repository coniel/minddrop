import { DataType } from '../types';

export const VideoDataType: DataType = {
  type: 'video',
  name: 'dataTypes.video.name',
  description: 'dataTypes.video.description',
  icon: 'content-icon:play:default',
  properties: [],
  file: true,
  fileExtensions: ['mp4', 'mov', 'w4v', 'webm', 'ogg', 'ogv'],
};
