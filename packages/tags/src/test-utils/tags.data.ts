import { generateId } from '@minddrop/utils';
import { Tag } from '../types';

export const tag1: Tag = {
  id: generateId(),
  label: 'Important',
  color: 'red',
};

export const tag2: Tag = {
  id: generateId(),
  label: 'Exam',
  color: 'orange',
};

export const tag3: Tag = {
  id: generateId(),
  label: 'Diagram',
  color: 'gray',
};

export const tag4: Tag = {
  id: generateId(),
  label: 'Equation',
  color: 'blue',
};

export const tags = [tag1, tag2, tag3, tag4];
