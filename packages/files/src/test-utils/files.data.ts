import { generateId } from '@minddrop/utils';
import { FileReference } from '../types';

export const textFileRef1: FileReference = {
  id: generateId(),
  name: 'text.txt',
  type: 'text/plain',
  size: 39,
  attachedTo: [],
};

export const imageFileRef: FileReference = {
  id: generateId(),
  name: 'image.png',
  type: 'image/png',
  size: 2405,
  attachedTo: [],
};

export const imageFileRef2: FileReference = {
  id: generateId(),
  name: 'image-2.png',
  type: 'image/png',
  size: 4028,
  attachedTo: [],
};

export const imageFileRef3: FileReference = {
  id: generateId(),
  name: 'image-3.jpg',
  type: 'image/jpg',
  size: 1043,
  attachedTo: [],
};

export const fileReferences = [
  textFileRef1,
  imageFileRef,
  imageFileRef2,
  imageFileRef3,
];
