import { TextElement } from '../types';

export type TextElementTemplate = Omit<TextElement, 'id'>;

export const TextElementTemplate: TextElementTemplate = {
  type: 'text',
  value: '',
};
