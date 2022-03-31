import React from 'react';
import { FileReference, FILES_TEST_DATA } from '@minddrop/files';
import { Drop, DropConfig, RegisteredDropConfig } from '../types';
import { generateDrop } from '../generateDrop';

export interface TextDrop extends Drop {
  text: string;
}

export interface HtmlDrop extends Drop {
  html: string;
}

export interface ImageDrop extends Drop {
  src: string;
}

export type TextDropConfig = DropConfig<TextDrop>;
export type HtmlDropConfig = DropConfig<HtmlDrop>;
export type ImageDropConfig = DropConfig<ImageDrop>;

export const textDropConfig: TextDropConfig = {
  type: 'text',
  name: 'Text',
  multiFile: true,
  description: 'A text drop',
  dataTypes: ['text/plain'],
  fileTypes: ['text/plain'],
  component: ({ text }) => <div>{text}</div>,
  create: (c, { data }) => ({ type: 'text', text: data['text/plain'] }),
  insertData: async (c, drop, { data }) => ({
    ...drop,
    text: data['text/plain'],
  }),
};

export const registeredTextDropConfig: RegisteredDropConfig = {
  ...textDropConfig,
  extension: 'drops',
};

export const htmlDropConfig: HtmlDropConfig = {
  type: 'html',
  name: 'HTML',
  dataTypes: ['text/html'],
  fileTypes: ['text/plain'],
  description: 'An HTML drop',
  component: ({ html }) => <div>{html}</div>,
  create: () => ({ type: 'html' }),
};

export const registeredHtmlDropConfig: RegisteredDropConfig = {
  ...htmlDropConfig,
  extension: 'drops',
};

export const imageDropConfig: ImageDropConfig = {
  type: 'image',
  name: 'Image',
  fileTypes: ['image/jpeg'],
  requiresFile: true,
  description: 'An image drop',
  component: ({ src }) => <img src={src} />,
  create: () => ({ type: 'image' }),
};

export const registeredImageDropConfig: RegisteredDropConfig<ImageDrop> = {
  ...imageDropConfig,
  extension: 'drops',
};

export const unregisteredDropConfig: DropConfig = {
  type: 'unregistered',
  name: 'Unregistered',
  dataTypes: ['text/plain'],
  description: 'An unregistered drop type',
  component: () => <div />,
  create: () => ({ type: 'unregistered' }),
};

export const textDrop1 = generateDrop({
  id: 'text-drop-1',
  type: 'text',
  text: 'Lorem ipsum dolor sit amet, scripta suavitate iudicabit usu in, pro ei constituto dissentias.',
});

export const textDrop2 = generateDrop({
  id: 'text-drop-2',
  type: 'text',
  contentRevision: 'rev-1',
  text: 'Nam ei nostro tibique aliquando. Consequat consetetur ut duo. Has tempor sententiae ad.',
});

export const textDrop3 = generateDrop({
  id: 'text-drop-3',
  type: 'text',
  text: 'Vix ei nostro prodesset, definitionem mediocritatem ne eum.',
});

export const textDrop4 = generateDrop({
  id: 'text-drop-4',
  type: 'text',
  text: 'Velit iriure incorrupte ad duo. Eu sea constituam neglegentur.',
});

export const textDrop5 = generateDrop({
  id: 'text-drop-5',
  type: 'text',
  text: 'Nam eget nunc eu mi efficitur condimentum non vitae arcu.',
});

export const textDrop6 = generateDrop({
  id: 'text-drop-6',
  type: 'text',
  text: 'Ut imperdiet luctus scelerisque.',
});

export const htmlDrop1 = generateDrop({
  id: 'html-drop-1',
  type: 'html',
  text: 'Alia eruditi adolescens at mea, munere equidem comprehensam in vel.',
});

export const imageDrop1 = generateDrop({
  id: 'image-drop-1',
  type: 'image',
  src: 'image.png',
  files: [FILES_TEST_DATA.imageFileRef.id],
});

// Create file references for file based drops
export const dropFiles: FileReference[] = [
  { ...FILES_TEST_DATA.imageFileRef, attachedTo: [imageDrop1.id] },
];

export const dropTypeConfigs = [
  textDropConfig,
  htmlDropConfig,
  imageDropConfig,
];

export const registeredDropTypeConfigs = [
  registeredTextDropConfig,
  registeredHtmlDropConfig,
  registeredImageDropConfig,
];

export const drops = [
  textDrop1,
  textDrop2,
  textDrop3,
  textDrop4,
  textDrop5,
  textDrop6,
  htmlDrop1,
  imageDrop1,
];
