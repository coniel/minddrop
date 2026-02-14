import { TextPropertyElement } from '../types';

export type TextPropertyElementTemplate = Omit<TextPropertyElement, 'id'>;

export const TextPropertyElementTemplate: TextPropertyElementTemplate = {
  type: 'text-property',
  property: '',
  style: {},
};
