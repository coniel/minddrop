import { Resources } from '@minddrop/resources';
import { FileReference } from '../types';

export const textFileRef1: FileReference = Resources.generateDocument(
  'files:file-reference',
  {
    name: 'text.txt',
    type: 'text/plain',
    size: 39,
  },
);

export const imageFileRef1: FileReference = Resources.generateDocument(
  'files:file-reference',
  {
    name: 'image.png',
    type: 'image/png',
    size: 2405,
  },
);

export const imageFileRef2: FileReference = Resources.generateDocument(
  'files:file-reference',
  {
    name: 'image-2.png',
    type: 'image/png',
    size: 4028,
  },
);

export const imageFileRef3: FileReference = Resources.generateDocument(
  'files:file-reference',
  {
    name: 'image-3.jpg',
    type: 'image/jpg',
    size: 1043,
  },
);

export const fileReferences = [
  textFileRef1,
  imageFileRef1,
  imageFileRef2,
  imageFileRef3,
];
