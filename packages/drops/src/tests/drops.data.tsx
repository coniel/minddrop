import React from 'react';
import { Drop, DropConfig } from '../types';
import { generateDrop } from '../generateDrop';

export interface ImageDrop extends Drop {
  src: string;
}

export type ImageDropConfig = DropConfig<ImageDrop>;

export const textDropConfig: DropConfig = {
  type: 'text',
  name: 'Text',
  multiFile: true,
  description: 'A text drop',
  dataTypes: ['text/plain'],
  fileTypes: ['text/plain'],
  component: ({ markdown }) => <div>{markdown}</div>,
  create: async () => generateDrop({ type: 'text', markdown: '' }),
  insertData: async (c, drop, { data }) => ({
    ...drop,
    markdown: data['text/plain'],
  }),
};

export const htmlDropConfig: DropConfig = {
  type: 'html',
  name: 'HTML',
  dataTypes: ['text/html'],
  fileTypes: ['text/plain'],
  description: 'An HTML drop',
  component: ({ markdown }) => <div>{markdown}</div>,
  create: async () => generateDrop({ type: 'html' }),
};

export const imageDropConfig: ImageDropConfig = {
  type: 'image',
  name: 'Image',
  fileTypes: ['image/jpeg'],
  requiresFile: true,
  description: 'An image drop',
  component: ({ src }) => <img src={src} />,
  create: async () => generateDrop({ type: 'image' }),
};

export const unregisteredDropConfig: DropConfig = {
  type: 'unregistered',
  name: 'Unregistered',
  dataTypes: ['text/plain'],
  description: 'An unregistered drop type',
  component: ({ markdown }) => <div>{markdown}</div>,
  create: async () => generateDrop({ type: 'unregistered' }),
};

export const dropTypeConfigs = [
  textDropConfig,
  htmlDropConfig,
  imageDropConfig,
];

export const textDrop: Drop = {
  id: 'text-drop',
  type: 'text',
  createdAt: new Date(),
  updatedAt: new Date(),
  markdown: 'drop content',
};
