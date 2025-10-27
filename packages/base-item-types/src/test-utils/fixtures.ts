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
  icon: 'content-icon:document:blue',
  properties: [],
};

export const urlBaseItemType: UrlBaseItemTypeConfig = {
  type: 'url',
  dataType: 'url',
  name: 'URL',
  description: 'A base item type for URL based content.',
  icon: 'content-icon:link:green',
  properties: [
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'domain',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
};

export const textBaseItemType: TextBaseItemTypeConfig = {
  type: 'text',
  dataType: 'text',
  name: 'Text',
  description: 'A base item type for text based content.',
  icon: 'content-icon:text-document:orange',
  properties: [],
};

export const imageBaseItemType: ImageBaseItemTypeConfig = {
  type: 'image',
  dataType: 'image',
  name: 'Image',
  description: 'A base item type for image file based content.',
  icon: 'content-icon:image:purple',
  properties: [],
};

export const audioBaseItemType: AudioBaseItemTypeConfig = {
  type: 'audio',
  dataType: 'audio',
  name: 'Audio',
  description: 'A base item type for audio file based content.',
  icon: 'content-icon:audio:teal',
  properties: [],
};

export const videoBaseItemType: VideoBaseItemTypeConfig = {
  type: 'video',
  dataType: 'video',
  name: 'Video',
  description: 'A base item type for video file based content.',
  icon: 'content-icon:video:red',
  properties: [],
};

export const pdfBaseItemType: PdfBaseItemTypeConfig = {
  type: 'pdf',
  dataType: 'pdf',
  name: 'PDF',
  description: 'A base item type for PDF file based content.',
  icon: 'content-icon:pdf:gray',
  properties: [],
};

export const fileBaseItemType: FileBaseItemTypeConfig = {
  type: 'file',
  dataType: 'file',
  name: 'File',
  description: 'A base item type for generic file based content.',
  icon: 'content-icon:file:dark-gray',
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
