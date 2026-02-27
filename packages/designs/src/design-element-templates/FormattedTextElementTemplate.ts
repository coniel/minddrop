import { FormattedTextElement } from '../types';

export type FormattedTextElementTemplate = Omit<FormattedTextElement, 'id'>;

export const FormattedTextElementTemplate: FormattedTextElementTemplate = {
  type: 'formatted-text',
};
