import { i18n } from '@minddrop/i18n';
import { DataType } from '../types';

export const AudioDataType: DataType = {
  type: 'audio',
  name: i18n.t('databases.audio.name'),
  description: i18n.t('databases.audio.description'),
  icon: 'content-icon:headphones:default',
  properties: [],
  file: true,
  fileExtensions: ['mp3', 'wav', 'aac', 'ogg'],
};
