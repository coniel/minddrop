import { i18n } from '@minddrop/i18n';
import { DataType } from '../types';

export const VideoDataType: DataType = {
  type: 'video',
  name: i18n.t('databases.video.name'),
  description: i18n.t('databases.video.description'),
  icon: 'content-icon:play:default',
  properties: [],
  file: true,
  fileExtensions: ['mp4', 'mov', 'w4v', 'webm', 'ogg', 'ogv'],
};
