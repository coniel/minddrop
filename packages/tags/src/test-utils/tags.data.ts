import { Resources } from '@minddrop/resources';
import { Tag, TagData } from '../types';

export const tag1: Tag = Resources.generateDocument<TagData>('tags:tag', {
  label: 'Important',
  color: 'red',
});

export const tag2: Tag = Resources.generateDocument<TagData>('tags:tag', {
  label: 'Exam',
  color: 'orange',
});

export const tag3: Tag = Resources.generateDocument<TagData>('tags:tag', {
  label: 'Diagram',
  color: 'gray',
});

export const tag4: Tag = Resources.generateDocument<TagData>('tags:tag', {
  label: 'Equation',
  color: 'blue',
});

export const tags = [tag1, tag2, tag3, tag4];
