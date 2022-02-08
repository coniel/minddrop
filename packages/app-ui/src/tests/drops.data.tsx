import React from 'react';
import { Drop as DropComponent } from '@minddrop/ui';
import { Drop, DropConfig, generateDrop } from '@minddrop/drops';

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
  component: ({ markdown }) => <DropComponent>{markdown}</DropComponent>,
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
  component: ({ markdown }) => <DropComponent>{markdown}</DropComponent>,
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
  component: ({ markdown }) => <DropComponent>{markdown}</DropComponent>,
  create: async () => generateDrop({ type: 'unregistered' }),
};

export const textDrop1: Drop = {
  id: 'text-drop-1',
  type: 'text',
  createdAt: new Date(),
  updatedAt: new Date(),
  markdown: 'text drop 1',
};

export const textDrop2: Drop = {
  id: 'text-drop-2',
  type: 'text',
  createdAt: new Date(),
  updatedAt: new Date(),
  markdown: 'text drop 2',
};

export const textDrop3: Drop = {
  id: 'text-drop-3',
  type: 'text',
  createdAt: new Date(),
  updatedAt: new Date(),
  markdown: 'text drop 3',
};

export const textDrop4: Drop = {
  id: 'text-drop-4',
  type: 'text',
  createdAt: new Date(),
  updatedAt: new Date(),
  markdown: 'text drop 4',
};

export const htmlDrop1: Drop = {
  id: 'html-drop-1',
  type: 'html',
  createdAt: new Date(),
  updatedAt: new Date(),
  markdown: 'html drop 1',
};

export const dropTypeConfigs = [
  textDropConfig,
  htmlDropConfig,
  imageDropConfig,
];

export const drops = [textDrop1, textDrop2, textDrop3, textDrop4, htmlDrop1];
