import { generateId } from '@minddrop/utils';
import { FileReference } from '../types';

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

export const fileReferences = [imageFileRef, imageFileRef2, imageFileRef3];
