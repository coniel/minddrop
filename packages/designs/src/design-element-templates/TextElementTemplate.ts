import { StaticTextElement } from '../types';

export type TextElementTemplate = Omit<StaticTextElement, 'id'>;

export const TextElementTemplate: TextElementTemplate = {
  type: 'static-text',
  value: '',
};
