import React from 'react';
import { FileReference, FILES_TEST_DATA } from '@minddrop/files';
import { Drop, DropConfig, RegisteredDropConfig } from '../types';
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
  create: (c, { data }) => ({ type: 'text', markdown: data['text/plain'] }),
  insertData: async (c, drop, { data }) => ({
    ...drop,
    markdown: data['text/plain'],
  }),
};

export const registeredTextDropConfig: RegisteredDropConfig = {
  ...textDropConfig,
  extension: 'drops',
};

export const htmlDropConfig: DropConfig = {
  type: 'html',
  name: 'HTML',
  dataTypes: ['text/html'],
  fileTypes: ['text/plain'],
  description: 'An HTML drop',
  component: ({ markdown }) => <div>{markdown}</div>,
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
  component: ({ markdown }) => <div>{markdown}</div>,
  create: () => ({ type: 'unregistered' }),
};

export const textDrop1 = generateDrop({
  id: 'text-drop-1',
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Position and its derivatives' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'The position of a point particle is defined in relation to a coordinate system centred on an arbitrary fixed reference point in space called the origin O. A simple coordinate system might describe the position of a particle P with a vector notated by an arrow labeled r that points from the origin O to point P.',
        },
      ],
    },
  ]),
  markdown:
    'Lorem ipsum dolor sit amet, scripta suavitate iudicabit usu in, pro ei constituto dissentias. Duo voluptua invidunt an. Audire labores duo at. Antiopam necessitatibus mel in, alterum percipitur his id.',
});

export const textDrop2 = generateDrop({
  id: 'text-drop-2',
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Classical mechanics' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'Classical mechanics is a physical theory describing the motion of macroscopic objects, from parts of machinery to stars and galaxies.',
        },
      ],
    },
  ]),
  markdown:
    'Nam ei nostro tibique aliquando. Consequat consetetur ut duo. Has tempor sententiae ad. Suscipit petentium molestiae ne sed, his augue dolore imperdiet cu.',
});

export const textDrop3 = generateDrop({
  id: 'text-drop-3',
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Law of inertia' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'An object at rest remains at rest, and an object that is moving will continue to move straight and with constant velocity, if and only if there is no net force acting on that object.',
        },
      ],
    },
  ]),
  markdown:
    'Vix ei nostro prodesset, definitionem mediocritatem ne eum. No partem sadipscing contentiones sed, vim at nobis aeterno civibus. Mea tollit meliore in. In mea nostrud eligendi convenire. Mei ex quodsi vocent reprehendunt. Ex eum solet numquam, mel facilis volutpat et.',
});

export const textDrop4 = generateDrop({
  id: 'text-drop-4',
  type: 'text',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Acceleration' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'The acceleration, or rate of change of velocity, is the derivative of the velocity with respect to time.',
        },
      ],
    },
  ]),
  markdown:
    'Velit iriure incorrupte ad duo. Eu sea constituam neglegentur. Clita ullamcorper te pro. Ne ius alii idque efficiantur, impetus oportere tractatos ea nec, mel munere consulatu rationibus ea. Vis te lucilius principes dignissim.',
});

export const textDrop5 = generateDrop({
  id: 'text-drop-5',
  type: 'text',
  markdown:
    'Nam eget nunc eu mi efficitur condimentum non vitae arcu. Cras pharetra massa id libero imperdiet tincidunt.',
});

export const textDrop6 = generateDrop({
  id: 'text-drop-6',
  type: 'text',
  markdown:
    'Ut imperdiet luctus scelerisque. Vestibulum condimentum finibus bibendum. Suspendisse vel maximus turpis. Sed dignissim turpis eget efficitur mattis.',
});

export const htmlDrop1 = generateDrop({
  id: 'html-drop-1',
  type: 'html',
  markdown:
    'Alia eruditi adolescens at mea, munere equidem comprehensam in vel. Mel vivendo dissentiunt an, pro habeo torquatos cu, ut phaedrum invenire sit. Sea fabulas mediocrem id, his essent liberavisse te. In qui quod dicam ignota. Eu ius persecuti cotidieque. Vix ipsum eruditi placerat id, at mei simul blandit.',
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
