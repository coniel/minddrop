import { PropertyType } from '@minddrop/properties';
import {
  AudioBaseItemTypeConfig,
  BaseItemTypeConfig,
  FileBaseItemTypeConfig,
  ImageBaseItemTypeConfig,
  MarkdownBaseItemTypeConfig,
  PdfBaseItemTypeConfig,
  TextBaseItemTypeConfig,
  UrlBaseItemTypeConfig,
  VideoBaseItemTypeConfig,
} from '../types';

export const markdownBaseItemType: MarkdownBaseItemTypeConfig = {
  type: 'markdown',
  dataType: 'markdown',
  name: 'Markdown',
  description: 'A base item type for markdown based content.',
  properties: [],
};

export const urlBaseItemType: UrlBaseItemTypeConfig = {
  type: 'url',
  dataType: 'url',
  name: 'URL',
  description: 'A base item type for URL based content.',
  properties: [
    {
      name: 'url',
      type: PropertyType.Text,
    },
    {
      name: 'domain',
      type: PropertyType.Text,
    },
    {
      name: 'description',
      type: PropertyType.Text,
    },
  ],
};

export const textBaseItemType: TextBaseItemTypeConfig = {
  type: 'text',
  dataType: 'text',
  name: 'Text',
  description: 'A base item type for text based content.',
  properties: [],
};

export const imageBaseItemType: ImageBaseItemTypeConfig = {
  type: 'image',
  dataType: 'image',
  name: 'Image',
  description: 'A base item type for image file based content.',
  properties: [],
};

export const audioBaseItemType: AudioBaseItemTypeConfig = {
  type: 'audio',
  dataType: 'audio',
  name: 'Audio',
  description: 'A base item type for audio file based content.',
  properties: [],
};

export const videoBaseItemType: VideoBaseItemTypeConfig = {
  type: 'video',
  dataType: 'video',
  name: 'Video',
  description: 'A base item type for video file based content.',
  properties: [],
};

export const pdfBaseItemType: PdfBaseItemTypeConfig = {
  type: 'pdf',
  dataType: 'pdf',
  name: 'PDF',
  description: 'A base item type for PDF file based content.',
  properties: [],
};

export const fileBaseItemType: FileBaseItemTypeConfig = {
  type: 'file',
  dataType: 'file',
  name: 'File',
  description: 'A base item type for generic file based content.',
  properties: [],
};

export const baseItemTypes: BaseItemTypeConfig[] = [
  markdownBaseItemType,
  urlBaseItemType,
  textBaseItemType,
  imageBaseItemType,
  audioBaseItemType,
  videoBaseItemType,
  pdfBaseItemType,
  fileBaseItemType,
];
