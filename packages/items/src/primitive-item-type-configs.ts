import { i18n } from '@minddrop/i18n';
import {
  AudioItemTypeConfig,
  DataItemTypeConfig,
  FileItemTypeConfig,
  ImageItemTypeConfig,
  MarkdownItemTypeConfig,
  PdfItemTypeConfig,
  TextItemTypeConfig,
  UrlItemTypeConfig,
  VideoItemTypeConfig,
} from './types';

export const DataItem: DataItemTypeConfig = {
  dataType: 'data',
  type: 'data',
  name: i18n.t('items.data.name'),
  description: i18n.t('items.data.description'),
};

export const TextItem: TextItemTypeConfig = {
  dataType: 'text',
  type: 'text',
  name: i18n.t('items.text.name'),
  description: i18n.t('items.text.description'),
};

export const MarkdownItem: MarkdownItemTypeConfig = {
  dataType: 'markdown',
  type: 'markdown',
  name: i18n.t('items.markdown.name'),
  description: i18n.t('items.markdown.description'),
};

export const UrlItem: UrlItemTypeConfig = {
  dataType: 'url',
  type: 'url',
  name: i18n.t('items.url.name'),
  description: i18n.t('items.url.description'),
};

export const ImageItem: ImageItemTypeConfig = {
  dataType: 'image',
  type: 'image',
  name: i18n.t('items.image.name'),
  description: i18n.t('items.image.description'),
};

export const VideoItem: VideoItemTypeConfig = {
  dataType: 'video',
  type: 'video',
  name: i18n.t('items.video.name'),
  description: i18n.t('items.video.description'),
};

export const AudioItem: AudioItemTypeConfig = {
  dataType: 'audio',
  type: 'audio',
  name: i18n.t('items.audio.name'),
  description: i18n.t('items.audio.description'),
};

export const PdfItem: PdfItemTypeConfig = {
  dataType: 'pdf',
  type: 'pdf',
  name: i18n.t('items.pdf.name'),
  description: i18n.t('items.pdf.description'),
};

export const FileItem: FileItemTypeConfig = {
  dataType: 'file',
  type: 'file',
  name: i18n.t('items.file.name'),
  description: i18n.t('items.file.description'),
};
